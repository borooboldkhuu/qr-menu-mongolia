import { Injectable, NotFoundException, ForbiddenException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateMenuItemDto, UpdateMenuItemDto } from './menu-items.dto';

@Injectable()
export class MenuItemsService {
  constructor(private prisma: PrismaService) {}

  async findAll(restaurantSlug: string, userId: string, categoryId?: string) {
    await this.validateRestaurantAccess(restaurantSlug, userId);
    return this.prisma.menuItem.findMany({
      where: {
        category: { restaurant: { slug: restaurantSlug } },
        ...(categoryId ? { categoryId } : {}),
      },
      include: { category: { select: { id: true, name: true } } },
      orderBy: [{ sortOrder: 'asc' }, { createdAt: 'desc' }],
    });
  }

  async create(restaurantSlug: string, userId: string, dto: CreateMenuItemDto) {
    await this.validateRestaurantAccess(restaurantSlug, userId);
    return this.prisma.menuItem.create({ data: dto });
  }

  async update(restaurantSlug: string, userId: string, id: string, dto: UpdateMenuItemDto) {
    await this.validateRestaurantAccess(restaurantSlug, userId);
    const item = await this.prisma.menuItem.findFirst({
      where: { id, category: { restaurant: { slug: restaurantSlug } } },
    });
    if (!item) throw new NotFoundException('Хоол олдсонгүй');
    return this.prisma.menuItem.update({ where: { id }, data: dto });
  }

  async remove(restaurantSlug: string, userId: string, id: string) {
    await this.validateRestaurantAccess(restaurantSlug, userId);
    await this.prisma.menuItem.delete({ where: { id } });
    return { message: 'Хоол устгагдлаа' };
  }

  async toggleAvailability(restaurantSlug: string, userId: string, id: string) {
    await this.validateRestaurantAccess(restaurantSlug, userId);
    const item = await this.prisma.menuItem.findUnique({ where: { id } });
    return this.prisma.menuItem.update({
      where: { id },
      data: { isAvailable: !item!.isAvailable },
    });
  }

  async updateImage(restaurantSlug: string, userId: string, id: string, imageUrl: string) {
    await this.validateRestaurantAccess(restaurantSlug, userId);
    return this.prisma.menuItem.update({ where: { id }, data: { imageUrl } });
  }

  private async validateRestaurantAccess(slug: string, userId: string) {
    const restaurant = await this.prisma.restaurant.findUnique({ where: { slug } });
    if (!restaurant) throw new NotFoundException('Ресторан олдсонгүй');
    if (restaurant.userId !== userId) throw new ForbiddenException();
    return restaurant;
  }
}
