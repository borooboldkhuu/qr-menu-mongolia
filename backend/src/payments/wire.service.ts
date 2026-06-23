import { Injectable, BadRequestException, Logger } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { SubscriptionTier } from '@prisma/client';
import * as crypto from 'crypto';

@Injectable()
export class WireService {
  private readonly logger = new Logger(WireService.name);

  private readonly API_BASE = 'https://api.wire.mn/v1';
  private readonly SECRET = process.env.WIRE_SECRET || '';
  private readonly WEBHOOK_SECRET = process.env.WIRE_WEBHOOK_SECRET || '';
  private readonly FRONTEND_URL = process.env.FRONTEND_URL || 'https://qr-menu-mn.vercel.app';

  private readonly TIER_PRICES: Record<string, number> = {
    STARTER: 29000,
    PRO: 49000,
    ENTERPRISE: 79000,
  };

  constructor(private prisma: PrismaService) {}

  /**
   * Wire төлбөрийн checkout session үүсгэх
   */
  async createCheckout(restaurantSlug: string, userId: string, tier: SubscriptionTier) {
    const restaurant = await this.prisma.restaurant.findUnique({ where: { slug: restaurantSlug } });
    if (!restaurant || restaurant.userId !== userId) throw new BadRequestException('Ресторан олдсонгүй');

    if (!this.SECRET) {
      throw new BadRequestException('Wire төлбөрийн тохиргоо хийгдээгүй. Админ шууд идэвхжүүлэх товчийг ашиглана уу.');
    }

    const amount = this.TIER_PRICES[tier];
    const idemKey = `sub_${restaurantSlug}_${tier}_${Date.now()}`;

    try {
      // 1. Payment Intent үүсгэх
      const piRes = await fetch(`${this.API_BASE}/payment_intents`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${this.SECRET}`,
          'Idempotency-Key': idemKey,
        },
        body: JSON.stringify({
          amount,
          currency: 'MNT',
          description: `QR Menu Mongolia — ${tier} багц (${restaurant.name})`,
          metadata: {
            restaurant_id: restaurant.id,
            restaurant_slug: restaurantSlug,
            tier,
          },
        }),
      });

      const pi = await piRes.json();
      if (!piRes.ok) {
        this.logger.error('Wire payment_intent failed', pi);
        throw new BadRequestException('Wire төлбөрийн холбоос үүсгэхэд алдаа гарлаа');
      }

      // 2. Checkout Session үүсгэх
      const csRes = await fetch(`${this.API_BASE}/checkout/sessions`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${this.SECRET}`,
          'Idempotency-Key': `${idemKey}_cs`,
        },
        body: JSON.stringify({
          payment_intent: pi.id,
          success_url: `${this.FRONTEND_URL}/subscription?success=true`,
          cancel_url: `${this.FRONTEND_URL}/subscription?canceled=true`,
          metadata: {
            restaurant_id: restaurant.id,
            tier,
          },
        }),
      });

      const cs = await csRes.json();
      if (!csRes.ok) {
        this.logger.error('Wire checkout/sessions failed', cs);
        throw new BadRequestException('Wire checkout session үүсгэхэд алдаа гарлаа');
      }

      // 3. Pending захиалга хадгалах
      await this.prisma.subscription.create({
        data: {
          restaurantId: restaurant.id,
          tier,
          status: 'PAST_DUE',
          amount,
          startedAt: new Date(),
          expiresAt: new Date(Date.now() + 30 * 24 * 3600000),
          paymentMethod: 'WIRE',
        },
      });

      return { checkoutUrl: cs.url, paymentIntentId: pi.id };
    } catch (err: any) {
      if (err instanceof BadRequestException) throw err;
      this.logger.error('Wire checkout error', err);
      throw new BadRequestException('Төлбөр үүсгэхэд алдаа гарлаа');
    }
  }

  /**
   * Wire webhook signature шалгах (HMAC-SHA256)
   */
  verifySignature(rawBody: string, signature: string): boolean {
    if (!this.WEBHOOK_SECRET) {
      this.logger.warn('WIRE_WEBHOOK_SECRET тохируулаагүй');
      return true;
    }
    if (!signature) return false;

    const parts: Record<string, string> = {};
    signature.split(',').forEach(p => {
      const [k, v] = p.trim().split('=');
      parts[k] = v;
    });

    const t = parseInt(parts.t || '0');
    const v1 = parts.v1 || '';
    if (!t || !v1) return false;

    const now = Math.floor(Date.now() / 1000);
    if (Math.abs(now - t) > 300) {
      this.logger.warn(`Wire webhook timestamp too old: diff=${Math.abs(now - t)}s`);
      return false;
    }

    const expected = crypto
      .createHmac('sha256', this.WEBHOOK_SECRET)
      .update(`${t}.${rawBody}`)
      .digest('hex');

    if (!crypto.timingSafeEqual(Buffer.from(expected), Buffer.from(v1))) {
      this.logger.warn('Wire signature mismatch');
      return false;
    }

    return true;
  }

  /**
   * Webhook callback боловсруулах
   */
  async handleWebhook(rawBody: string, signature: string) {
    if (!this.verifySignature(rawBody, signature)) {
      return { ok: false, reason: 'invalid_signature' };
    }

    let event: any;
    try { event = JSON.parse(rawBody); } catch {
      return { ok: false, reason: 'invalid_json' };
    }

    this.logger.log(`Wire webhook: ${event.type}`);

    // Endpoint баталгаажуулалт
    if (event.type === 'endpoint.verification' || event.type === 'ping') {
      return { ok: true, verified: true };
    }

    // Төлбөр амжилттай
    if (
      event.type === 'payment_intent.succeeded' ||
      event.type === 'checkout.session.completed' ||
      event.type === 'payment.success' ||
      event.status === 'PAID'
    ) {
      const metadata = event.data?.object?.metadata || event.metadata || {};
      const restaurantId = metadata.restaurant_id;

      if (restaurantId) {
        await this.prisma.subscription.updateMany({
          where: { restaurantId, paymentMethod: 'WIRE', status: 'PAST_DUE' },
          data: { status: 'ACTIVE' },
        });
      } else {
        await this.prisma.subscription.updateMany({
          where: { paymentMethod: 'WIRE', status: 'PAST_DUE' },
          data: { status: 'ACTIVE' },
        });
      }
      this.logger.log(`Захиалга идэвхжлээ: ${restaurantId || 'unknown'}`);
    }

    return { ok: true };
  }
}
