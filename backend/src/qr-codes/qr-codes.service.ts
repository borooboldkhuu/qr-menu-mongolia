import { Injectable, NotFoundException, ForbiddenException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import * as QRCode from 'qrcode';

@Injectable()
export class QrCodesService {
  constructor(private prisma: PrismaService) {}

  async findAll(restaurantSlug: string, userId: string) {
    await this.validateRestaurantAccess(restaurantSlug, userId);
    return this.prisma.qrCode.findMany({
      where: { restaurant: { slug: restaurantSlug } },
      include: { _count: { select: { qrAnalytics: true } } },
      orderBy: { createdAt: 'desc' },
    });
  }

  async create(restaurantSlug: string, userId: string) {
    const restaurant = await this.validateRestaurantAccess(restaurantSlug, userId);
    const publicUrl = `${process.env.APP_URL || 'http://localhost:3000'}/menu/${restaurant.slug}`;

    const qrImageDataUrl = await QRCode.toDataURL(publicUrl, {
      width: 512,
      margin: 2,
      color: { dark: '#000000', light: '#ffffff' },
    });

    const qrSvg = await QRCode.toString(publicUrl, {
      type: 'svg',
      margin: 2,
      color: { dark: '#000000', light: '#ffffff' },
    });

    // Count existing to create a label
    const count = await this.prisma.qrCode.count({
      where: { restaurantId: restaurant.id },
    });

    return this.prisma.qrCode.create({
      data: {
        restaurantId: restaurant.id,
        slug: `${restaurant.slug}-qr-${count + 1}`,
        qrImageUrl: qrImageDataUrl,
        qrSvgUrl: qrSvg,
      },
    });
  }

  async getPng(restaurantSlug: string, userId: string, id: string) {
    await this.validateRestaurantAccess(restaurantSlug, userId);
    const qrCode = await this.prisma.qrCode.findFirst({
      where: { id, restaurant: { slug: restaurantSlug } },
    });
    if (!qrCode) throw new NotFoundException('QR код олдсонгүй');
    return qrCode.qrImageUrl;
  }

  async getSvg(restaurantSlug: string, userId: string, id: string) {
    await this.validateRestaurantAccess(restaurantSlug, userId);
    const qrCode = await this.prisma.qrCode.findFirst({
      where: { id, restaurant: { slug: restaurantSlug } },
    });
    if (!qrCode) throw new NotFoundException('QR код олдсонгүй');
    return qrCode.qrSvgUrl;
  }

  async remove(restaurantSlug: string, userId: string, id: string) {
    await this.validateRestaurantAccess(restaurantSlug, userId);
    await this.prisma.qrCode.delete({ where: { id } });
    return { message: 'QR код устгагдлаа' };
  }

  private async validateRestaurantAccess(slug: string, userId: string) {
    const restaurant = await this.prisma.restaurant.findUnique({ where: { slug } });
    if (!restaurant) throw new NotFoundException('Ресторан олдсонгүй');
    if (restaurant.userId !== userId) throw new ForbiddenException();
    return restaurant;
  }
}
