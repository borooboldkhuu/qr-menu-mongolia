import {
  Injectable,
  NotFoundException,
  ForbiddenException,
} from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateRestaurantDto, UpdateRestaurantDto } from './restaurants.dto';

@Injectable()
export class RestaurantsService {
  constructor(private prisma: PrismaService) {}

  async findAll(userId: string) {
    return this.prisma.restaurant.findMany({
      where: { userId },
      include: {
        _count: {
          select: { categories: true, menuItems: true },
        },
      },
      orderBy: { createdAt: 'desc' },
    });
  }

  async findBySlug(slug: string, userId: string) {
    const restaurant = await this.prisma.restaurant.findUnique({
      where: { slug },
      include: {
        _count: {
          select: { categories: true, menuItems: true, qrCodes: true },
        },
      },
    });

    if (!restaurant) throw new NotFoundException('Ресторан олдсонгүй');
    if (restaurant.userId !== userId) throw new ForbiddenException();

    return restaurant;
  }

  async create(userId: string, dto: CreateRestaurantDto) {
    const existing = await this.prisma.restaurant.findUnique({
      where: { slug: dto.slug },
    });
    if (existing) throw new ForbiddenException('Slug бүртгэлтэй байна');

    return this.prisma.restaurant.create({
      data: { ...dto, userId },
    });
  }

  async update(slug: string, userId: string, dto: UpdateRestaurantDto) {
    await this.findBySlug(slug, userId);
    return this.prisma.restaurant.update({
      where: { slug },
      data: dto,
    });
  }

  async updateLogo(slug: string, userId: string, logoUrl: string) {
    await this.findBySlug(slug, userId);
    return this.prisma.restaurant.update({
      where: { slug },
      data: { logoUrl },
    });
  }

  async updateCover(slug: string, userId: string, coverUrl: string) {
    await this.findBySlug(slug, userId);
    return this.prisma.restaurant.update({
      where: { slug },
      data: { coverUrl },
    });
  }

  async remove(slug: string, userId: string) {
    await this.findBySlug(slug, userId);
    await this.prisma.restaurant.delete({ where: { slug } });
    return { message: 'Ресторан устгагдлаа' };
  }
}
