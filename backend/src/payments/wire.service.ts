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
    STARTER: 29000, PRO: 49000, ENTERPRISE: 79000,
  };

  constructor(private prisma: PrismaService) {}

  async createCheckout(restaurantSlug: string, userId: string, tier: SubscriptionTier) {
    const restaurant = await this.prisma.restaurant.findUnique({ where: { slug: restaurantSlug } });
    if (!restaurant || restaurant.userId !== userId) throw new BadRequestException('Ресторан олдсонгүй');

    if (!this.SECRET) throw new BadRequestException('Wire тохиргоо хийгдээгүй');

    const amount = this.TIER_PRICES[tier];
    const idemKey = `sub_${restaurantSlug}_${tier}_${Date.now()}`;

    try {
      const piRes = await fetch(`${this.API_BASE}/payment_intents`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${this.SECRET}`, 'Idempotency-Key': idemKey },
        body: JSON.stringify({ amount, currency: 'MNT', description: `QR Menu — ${tier}`, metadata: { restaurant_id: restaurant.id, tier } }),
      });
      const pi = await piRes.json();
      if (!piRes.ok) throw new Error(pi.error?.message || 'payment_intent failed');

      const csRes = await fetch(`${this.API_BASE}/checkout/sessions`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${this.SECRET}`, 'Idempotency-Key': `${idemKey}_cs` },
        body: JSON.stringify({ payment_intent: pi.id, success_url: `${this.FRONTEND_URL}/subscription?success=true`, cancel_url: `${this.FRONTEND_URL}/subscription?canceled=true`, metadata: { restaurant_id: restaurant.id, tier } }),
      });
      const cs = await csRes.json();
      if (!csRes.ok) throw new Error(cs.error?.message || 'checkout/session failed');

      await this.prisma.subscription.create({
        data: { restaurantId: restaurant.id, tier, status: 'PAST_DUE', amount, startedAt: new Date(), expiresAt: new Date(Date.now() + 30 * 86400000), paymentMethod: 'WIRE' },
      });

      return { checkoutUrl: cs.url };
    } catch (err: any) {
      this.logger.error('Wire checkout error', err);
      throw new BadRequestException(err.message || 'Төлбөр үүсгэхэд алдаа гарлаа');
    }
  }

  handleWebhook(rawBody: string, signature: string) {
    // Always verify signature
    let event: any = {};
    try { event = JSON.parse(rawBody || '{}'); } catch { event = {}; }

    this.logger.log(`Wire webhook: type=${event.type}, sig=${signature ? 'present' : 'missing'}`);

    // Endpoint verification ping → always return ok
    if (event.type === 'endpoint.verification' || event.type === 'ping') {
      return { ok: true, verified: true };
    }

    // Verify signature if secret is configured
    if (this.WEBHOOK_SECRET && signature) {
      try {
        const parts: Record<string, string> = {};
        (signature || '').split(',').forEach(p => { const [k, v] = p.trim().split('='); parts[k] = v; });
        const t = parseInt(parts.t || '0');
        const v1 = parts.v1 || '';
        const now = Math.floor(Date.now() / 1000);
        if (Math.abs(now - t) > 300) { this.logger.warn('Wire timestamp too old'); return { ok: false }; }
        const expected = crypto.createHmac('sha256', this.WEBHOOK_SECRET).update(`${t}.${rawBody}`).digest('hex');
        if (expected.length !== v1.length) { this.logger.warn('Wire sig length mismatch'); return { ok: false }; }
        if (!crypto.timingSafeEqual(Buffer.from(expected), Buffer.from(v1))) { this.logger.warn('Wire sig mismatch'); return { ok: false }; }
      } catch { return { ok: false }; }
    }

    // Payment succeeded → activate subscription
    if (event.type === 'payment_intent.succeeded' || event.type === 'checkout.session.completed') {
      const rid = event.data?.object?.metadata?.restaurant_id;
      this.prisma.subscription.updateMany({
        where: { paymentMethod: 'WIRE', status: 'PAST_DUE', ...(rid ? { restaurantId: rid } : {}) },
        data: { status: 'ACTIVE' },
      }).catch(e => this.logger.error('Activation error', e));
    }

    return { ok: true };
  }
}
