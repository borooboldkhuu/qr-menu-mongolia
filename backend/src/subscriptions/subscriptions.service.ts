import { Injectable, NotFoundException, ForbiddenException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { SubscriptionTier } from '@prisma/client';

@Injectable()
export class SubscriptionsService {
  constructor(private prisma: PrismaService) {}

  private TIER_PRICES: Record<SubscriptionTier, number> = {
    STARTER: 29000,
    PRO: 49000,
    ENTERPRISE: 79000,
  };

  async getCurrent(restaurantSlug: string, userId: string) {
    const restaurant = await this.validateRestaurantAccess(restaurantSlug, userId);
    const subscription = await this.prisma.subscription.findFirst({
      where: { restaurantId: restaurant.id },
      orderBy: { createdAt: 'desc' },
    });

    if (!subscription) {
      return {
        tier: restaurant.subscriptionTier,
        status: 'TRIAL',
        amount: 0,
        expiresAt: restaurant.subExpiresAt,
      };
    }

    return subscription;
  }

  async startTrial(restaurantSlug: string, userId: string) {
    const restaurant = await this.validateRestaurantAccess(restaurantSlug, userId);

    const trialEnd = new Date();
    trialEnd.setDate(trialEnd.getDate() + 14);

    await this.prisma.restaurant.update({
      where: { id: restaurant.id },
      data: { subExpiresAt: trialEnd, subscriptionTier: 'STARTER' },
    });

    return this.prisma.subscription.create({
      data: {
        restaurantId: restaurant.id,
        tier: 'STARTER',
        status: 'TRIAL',
        amount: 0,
        startedAt: new Date(),
        expiresAt: trialEnd,
      },
    });
  }

  async upgrade(restaurantSlug: string, userId: string, tier: SubscriptionTier) {
    const restaurant = await this.validateRestaurantAccess(restaurantSlug, userId);

    const expiresAt = new Date();
    expiresAt.setMonth(expiresAt.getMonth() + 1);

    const amount = this.TIER_PRICES[tier];

    await this.prisma.restaurant.update({
      where: { id: restaurant.id },
      data: { subscriptionTier: tier, subExpiresAt: expiresAt },
    });

    // Cancel existing active subscriptions
    await this.prisma.subscription.updateMany({
      where: { restaurantId: restaurant.id, status: 'ACTIVE' },
      data: { status: 'CANCELLED' },
    });

    return this.prisma.subscription.create({
      data: {
        restaurantId: restaurant.id,
        tier,
        status: 'ACTIVE',
        amount,
        startedAt: new Date(),
        expiresAt,
        paymentMethod: 'QPAY',
      },
    });
  }

  async cancel(restaurantSlug: string, userId: string) {
    const restaurant = await this.validateRestaurantAccess(restaurantSlug, userId);

    await this.prisma.subscription.updateMany({
      where: { restaurantId: restaurant.id, status: 'ACTIVE' },
      data: { status: 'CANCELLED' },
    });

    return { message: 'Захиалга цуцлагдлаа' };
  }

  async getInvoices(restaurantSlug: string, userId: string) {
    const restaurant = await this.validateRestaurantAccess(restaurantSlug, userId);
    return this.prisma.subscription.findMany({
      where: { restaurantId: restaurant.id },
      orderBy: { createdAt: 'desc' },
    });
  }

  private async validateRestaurantAccess(slug: string, userId: string) {
    const restaurant = await this.prisma.restaurant.findUnique({ where: { slug } });
    if (!restaurant) throw new NotFoundException('Ресторан олдсонгүй');
    if (restaurant.userId !== userId) throw new ForbiddenException();
    return restaurant;
  }
}
