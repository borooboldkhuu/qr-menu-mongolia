import { Injectable, BadRequestException, Logger } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { SubscriptionTier } from '@prisma/client';
import * as crypto from 'crypto';

@Injectable()
export class QpayService {
  private readonly logger = new Logger(QpayService.name);

  private readonly API_BASE = 'https://api.qpay.mn/v1';
  private readonly KEY_ID = process.env.QPAY_KEY_ID || '';
  private readonly SECRET = process.env.QPAY_SECRET || '';
  private readonly WEBHOOK_SECRET = process.env.QPAY_WEBHOOK_SECRET || '';

  private readonly TIER_PRICES: Record<string, number> = {
    STARTER: 29000,
    PRO: 49000,
    ENTERPRISE: 79000,
  };

  constructor(private prisma: PrismaService) {}

  async createInvoice(restaurantSlug: string, userId: string, tier: SubscriptionTier) {
    const restaurant = await this.prisma.restaurant.findUnique({ where: { slug: restaurantSlug } });
    if (!restaurant || restaurant.userId !== userId) throw new BadRequestException('Ресторан олдсонгүй');

    const amount = this.TIER_PRICES[tier];
    const invoiceId = `inv_${Date.now()}_${restaurantSlug}`;

    try {
      const response = await fetch(`${this.API_BASE}/invoice`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${this.KEY_ID}:${this.SECRET}`,
        },
        body: JSON.stringify({
          amount,
          currency: 'MNT',
          description: `QR Menu Mongolia - ${tier} багц (${restaurant.name})`,
          callback_url: `${process.env.API_URL}/api/v1/payments/qpay/callback`,
          return_url: `${process.env.FRONTEND_URL || 'http://localhost:3000'}/subscription?success=true`,
          invoice_id: invoiceId,
        }),
      });

      const data = await response.json();
      if (!response.ok) throw new BadRequestException(data.message || 'QPay алдаа');

      await this.prisma.subscription.create({
        data: {
          restaurantId: restaurant.id,
          tier,
          status: 'PAST_DUE',
          amount,
          startedAt: new Date(),
          expiresAt: new Date(Date.now() + 30 * 24 * 3600000),
          paymentMethod: 'QPAY',
        },
      });

      return { paymentUrl: data.url || data.qr_code || data, invoiceId };
    } catch (err: any) {
      this.logger.error('QPay invoice create failed', err);
      throw new BadRequestException('Төлбөр үүсгэхэд алдаа гарлаа: ' + (err.message || ''));
    }
  }

  verifySignature(payload: string, signature: string): boolean {
    if (!this.WEBHOOK_SECRET) {
      this.logger.warn('Webhook signing secret not configured, accepting request');
      return true;
    }
    if (!signature) {
      this.logger.warn('No signature header');
      return false;
    }

    const parts: Record<string, string> = {};
    signature.split(',').forEach(part => {
      const [k, v] = part.trim().split('=');
      parts[k] = v;
    });

    const t = parseInt(parts.t || '0');
    const v1 = parts.v1 || '';

    if (!t || !v1) {
      this.logger.warn('Missing t= or v1= in signature');
      return false;
    }

    const now = Math.floor(Date.now() / 1000);
    if (Math.abs(now - t) > 300) {
      this.logger.warn(`Timestamp too old: ${t}, now: ${now}`);
      return false;
    }

    const expected = crypto
      .createHmac('sha256', this.WEBHOOK_SECRET)
      .update(`${t}.${payload}`)
      .digest('hex');

    if (!crypto.timingSafeEqual(Buffer.from(expected), Buffer.from(v1))) {
      this.logger.warn('Signature mismatch');
      return false;
    }

    return true;
  }

  async handleCallback(rawBody: string, signature: string) {
    if (!this.verifySignature(rawBody, signature)) {
      return { ok: false, reason: 'signature' };
    }

    let body: any;
    try { body = JSON.parse(rawBody); } catch {
      this.logger.warn('Invalid JSON body');
      return { ok: false, reason: 'json' };
    }

    if (body.type === 'endpoint.verification') {
      this.logger.log('Webhook endpoint verified');
      return { ok: true, verified: true };
    }

    if (body.status === 'PAID' || body.type === 'payment.success') {
      const invoiceId = body.invoice_id || body.data?.invoice_id;
      if (invoiceId) {
        await this.prisma.subscription.updateMany({
          where: { paymentMethod: 'QPAY', status: 'PAST_DUE' },
          data: { status: 'ACTIVE' },
        });
        this.logger.log(`Payment confirmed: ${invoiceId}`);
      }
    }

    return { ok: true };
  }
}
