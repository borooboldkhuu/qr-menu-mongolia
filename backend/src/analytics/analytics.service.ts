import { Injectable, NotFoundException, ForbiddenException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { subDays, startOfDay, endOfDay } from 'date-fns';

@Injectable()
export class AnalyticsService {
  constructor(private prisma: PrismaService) {}

  async getDashboard(restaurantSlug: string, userId: string) {
    await this.validateRestaurantAccess(restaurantSlug, userId);

    const restaurant = await this.prisma.restaurant.findUnique({ where: { slug: restaurantSlug } });

    const [totalItems, totalCategories, totalScans, todayScans] = await Promise.all([
      this.prisma.menuItem.count({ where: { category: { restaurantId: restaurant!.id } } }),
      this.prisma.category.count({ where: { restaurantId: restaurant!.id } }),
      this.prisma.qrAnalytics.count({ where: { restaurantId: restaurant!.id } }),
      this.prisma.qrAnalytics.count({
        where: {
          restaurantId: restaurant!.id,
          scannedAt: { gte: startOfDay(new Date()), lte: endOfDay(new Date()) },
        },
      }),
    ]);

    return {
      totalItems,
      totalCategories,
      totalScans,
      todayScans,
      totalQrCodes: await this.prisma.qrCode.count({ where: { restaurantId: restaurant!.id } }),
    };
  }

  async getScansByDay(restaurantSlug: string, userId: string, days = 30) {
    await this.validateRestaurantAccess(restaurantSlug, userId);

    const since = subDays(new Date(), days);
    const scans = await this.prisma.qrAnalytics.findMany({
      where: {
        restaurant: { slug: restaurantSlug },
        scannedAt: { gte: since },
      },
      select: { scannedAt: true, deviceType: true },
      orderBy: { scannedAt: 'asc' },
    });

    // Group by date
    const grouped: Record<string, number> = {};
    for (const scan of scans) {
      const date = scan.scannedAt.toISOString().split('T')[0];
      grouped[date] = (grouped[date] || 0) + 1;
    }

    return Object.entries(grouped).map(([date, count]) => ({ date, count }));
  }

  async getDeviceBreakdown(restaurantSlug: string, userId: string) {
    await this.validateRestaurantAccess(restaurantSlug, userId);

    const analytics = await this.prisma.qrAnalytics.findMany({
      where: { restaurant: { slug: restaurantSlug } },
      select: { deviceType: true },
    });

    const breakdown: Record<string, number> = {};
    for (const a of analytics) {
      const device = a.deviceType || 'unknown';
      breakdown[device] = (breakdown[device] || 0) + 1;
    }

    return Object.entries(breakdown).map(([device, count]) => ({ device, count }));
  }

  async trackScan(restaurantSlug: string, qrCodeId: string, userAgent?: string, ipAddress?: string) {
    const restaurant = await this.prisma.restaurant.findUnique({ where: { slug: restaurantSlug } });
    if (!restaurant) return;

    const deviceType = this.detectDevice(userAgent);

    return this.prisma.qrAnalytics.create({
      data: {
        restaurantId: restaurant.id,
        qrCodeId,
        scannedAt: new Date(),
        userAgent,
        ipAddress,
        deviceType,
      },
    });
  }

  private detectDevice(userAgent?: string): string {
    if (!userAgent) return 'unknown';
    const ua = userAgent.toLowerCase();
    if (ua.includes('mobile') || ua.includes('android') || ua.includes('iphone')) return 'mobile';
    if (ua.includes('tablet') || ua.includes('ipad')) return 'tablet';
    return 'desktop';
  }

  private async validateRestaurantAccess(slug: string, userId: string) {
    const restaurant = await this.prisma.restaurant.findUnique({ where: { slug } });
    if (!restaurant) throw new NotFoundException('Ресторан олдсонгүй');
    if (restaurant.userId !== userId) throw new ForbiddenException();
    return restaurant;
  }
}
