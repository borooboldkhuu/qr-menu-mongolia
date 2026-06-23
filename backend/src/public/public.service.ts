import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class PublicService {
  constructor(private prisma: PrismaService) {}

  async getMenu(slug: string) {
    const restaurant = await this.prisma.restaurant.findUnique({
      where: { slug, isActive: true },
      select: {
        id: true,
        name: true,
        slug: true,
        logoUrl: true,
        coverUrl: true,
        address: true,
        phone: true,
        facebookUrl: true,
        instagramUrl: true,
        theme: true,
        primaryColor: true,
      },
    });

    if (!restaurant) throw new NotFoundException('Ресторан олдсонгүй');

    return restaurant;
  }

  async getCategories(slug: string) {
    const restaurant = await this.prisma.restaurant.findUnique({ where: { slug, isActive: true } });
    if (!restaurant) throw new NotFoundException('Ресторан олдсонгүй');

    return this.prisma.category.findMany({
      where: { restaurantId: restaurant.id, isActive: true },
      orderBy: { sortOrder: 'asc' },
    });
  }

  async getItems(slug: string, search?: string, categoryId?: string) {
    const restaurant = await this.prisma.restaurant.findUnique({ where: { slug, isActive: true } });
    if (!restaurant) throw new NotFoundException('Ресторан олдсонгүй');

    return this.prisma.menuItem.findMany({
      where: {
        category: { restaurantId: restaurant.id, isActive: true },
        isAvailable: true,
        ...(categoryId ? { categoryId } : {}),
        ...(search
          ? {
              OR: [
                { name: { contains: search, mode: 'insensitive' } },
                { description: { contains: search, mode: 'insensitive' } },
              ],
            }
          : {}),
      },
      include: { category: { select: { id: true, name: true } } },
      orderBy: [{ sortOrder: 'asc' }, { name: 'asc' }],
    });
  }

  async getItemsGrouped(slug: string) {
    const restaurant = await this.prisma.restaurant.findUnique({ where: { slug, isActive: true } });
    if (!restaurant) throw new NotFoundException('Ресторан олдсонгүй');

    const categories = await this.prisma.category.findMany({
      where: { restaurantId: restaurant.id, isActive: true },
      include: {
        menuItems: {
          where: { isAvailable: true },
          orderBy: [{ sortOrder: 'asc' }, { name: 'asc' }],
        },
      },
      orderBy: { sortOrder: 'asc' },
    });

    return {
      restaurant,
      categories,
    };
  }
}
