import { Injectable, BadRequestException, Logger } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { SubscriptionTier } from '@prisma/client';
import * as crypto from 'crypto';

@Injectable()
export class WireService {
  private readonly logger = new Logger(WireService.name);

  private readonly API_BASE = 'https://api.wirepay.mn/v1';
  private readonly KEY_ID = process.env.WIRE_KEY_ID || '';
  private readonly SECRET = process.env.WIRE_SECRET || '';
  private readonly WEBHOOK_SECRET = process.env.WIRE_WEBHOOK_SECRET || '';

  private readonly TIER_PRICES: Record<string, number> = {
    STARTER: 29000,
    PRO: 49000,
    ENTERPRISE: 79000,
  };

  constructor(private prisma: PrismaService) {}

  /**
   * Wire төлбөрийн нэхэмжлэх үүсгэх
   */
  async createCheckout(restaurantSlug: string, userId: string, tier: SubscriptionTier) {
    const restaurant = await this.prisma.restaurant.findUnique({ where: { slug: restaurantSlug } });
    if (!restaurant || restaurant.userId !== userId) throw new BadRequestException('Ресторан олдсонгүй');

    const amount = this.TIER_PRICES[tier];

    try {
      const body = {
        amount,
        currency: 'MNT',
        description: `QR Menu Mongolia — ${tier} багц`,
        metadata: {
          restaurant_id: restaurant.id,
          restaurant_slug: restaurantSlug,
          tier,
        },
        return_url: `${process.env.FRONTEND_URL || 'https://qr-menu-mn.vercel.app'}/subscription?success=true`,
        cancel_url: `${process.env.FRONTEND_URL || 'https://qr-menu-mn.vercel.app'}/subscription?canceled=true`,
      };

      const res = await fetch(`${this.API_BASE}/checkout`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${this.KEY_ID}:${this.SECRET}`,
        },
        body: JSON.stringify(body),
      });

      const data = await res.json();

      if (!res.ok) {
        this.logger.error('Wire checkout failed', data);
        throw new BadRequestException(data.message || data.error || 'Wire төлбөр үүсгэхэд алдаа гарлаа');
      }

      // Монголын 3-р банкны checkout холбоос
      const checkoutUrl = data.checkout_url || data.url || data.payment_url;

      // pending захиалга хадгална
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

      return { checkoutUrl };
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
      this.logger.warn('WIRE_WEBHOOK_SECRET тохируулаагүй — signature шалгалтгүй');
      return true;
    }

    if (!signature) {
      this.logger.warn('WirePayment-Signature header байхгүй');
      return false;
    }

    const parts: Record<string, string> = {};
    signature.split(',').forEach(p => {
      const [k, v] = p.trim().split('=');
      parts[k] = v;
    });

    const t = parseInt(parts.t || '0');
    const v1 = parts.v1 || '';

    if (!t || !v1) return false;

    // 5 минутаас хуучин хүсэлтийг татгалзах
    const now = Math.floor(Date.now() / 1000);
    if (Math.abs(now - t) > 300) {
      this.logger.warn(`Wire webhook хугацаа хэтэрсэн: t=${t}, now=${now}`);
      return false;
    }

    const expected = crypto
      .createHmac('sha256', this.WEBHOOK_SECRET)
      .update(`${t}.${rawBody}`)
      .digest('hex');

    if (!crypto.timingSafeEqual(Buffer.from(expected), Buffer.from(v1))) {
      this.logger.warn('Wire signature таарахгүй');
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

    this.logger.log(`Wire event: ${event.type}`);

    // Endpoint баталгаажуулалт
    if (event.type === 'endpoint.verification' || event.type === 'ping') {
      this.logger.log('Wire webhook баталгаажсан ✅');
      return { ok: true, verified: true };
    }

    // Төлбөр амжилттай
    if (
      event.type === 'payment.success' ||
      event.type === 'payment.completed' ||
      event.type === 'checkout.completed' ||
      event.status === 'PAID' ||
      event.status === 'COMPLETED'
    ) {
      const restaurantId = event.metadata?.restaurant_id || event.data?.metadata?.restaurant_id;

      if (restaurantId) {
        await this.prisma.subscription.updateMany({
          where: {
            restaurantId,
            paymentMethod: 'WIRE',
            status: 'PAST_DUE',
          },
          data: { status: 'ACTIVE' },
        });
        this.logger.log(`Захиалга идэвхжлээ: ${restaurantId}`);
      } else {
        // metadata байхгүй — бүх PENDING захиалгыг идэвхжүүлэх
        await this.prisma.subscription.updateMany({
          where: { paymentMethod: 'WIRE', status: 'PAST_DUE' },
          data: { status: 'ACTIVE' },
        });
      }
    }

    return { ok: true };
  }
}
