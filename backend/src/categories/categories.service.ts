import { Injectable, NotFoundException, ForbiddenException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateCategoryDto, UpdateCategoryDto } from './categories.dto';

@Injectable()
export class CategoriesService {
  constructor(private prisma: PrismaService) {}

  async findAll(restaurantSlug: string, userId: string) {
    await this.validateRestaurantAccess(restaurantSlug, userId);
    return this.prisma.category.findMany({
      where: { restaurant: { slug: restaurantSlug } },
      include: { _count: { select: { menuItems: true } } },
      orderBy: { sortOrder: 'asc' },
    });
  }

  async create(restaurantSlug: string, userId: string, dto: CreateCategoryDto) {
    const restaurant = await this.validateRestaurantAccess(restaurantSlug, userId);

    // Check category limit
    const limits: Record<string, number> = { STARTER: 10, PRO: 30, ENTERPRISE: 99999 };
    const limit = limits[restaurant.subscriptionTier] || 10;
    const count = await this.prisma.category.count({
      where: { restaurantId: restaurant.id },
    });
    if (count >= limit) {
      throw new ForbiddenException(`Ангилалын тоо хүрсэн (${count}/${limit}). Багцаа шинэчилнэ үү.`);
    }

    return this.prisma.category.create({ data: { ...dto, restaurantId: restaurant.id } });
  }

  async update(restaurantSlug: string, userId: string, id: string, dto: UpdateCategoryDto) {
    await this.validateRestaurantAccess(restaurantSlug, userId);
    const category = await this.prisma.category.findFirst({
      where: { id, restaurant: { slug: restaurantSlug } },
    });
    if (!category) throw new NotFoundException('Ангилал олдсонгүй');

    return this.prisma.category.update({ where: { id }, data: dto });
  }

  async remove(restaurantSlug: string, userId: string, id: string) {
    await this.validateRestaurantAccess(restaurantSlug, userId);
    await this.prisma.category.delete({ where: { id } });
    return { message: 'Ангилал устгагдлаа' };
  }

  async reorder(restaurantSlug: string, userId: string, ids: string[]) {
    await this.validateRestaurantAccess(restaurantSlug, userId);
    await this.prisma.$transaction(
      ids.map((id, index) =>
        this.prisma.category.update({
          where: { id },
          data: { sortOrder: index },
        }),
      ),
    );
    return { message: 'Эрэмбэ шинэчлэгдлээ' };
  }

  private async validateRestaurantAccess(slug: string, userId: string) {
    const restaurant = await this.prisma.restaurant.findUnique({ where: { slug } });
    if (!restaurant) throw new NotFoundException('Ресторан олдсонгүй');
    if (restaurant.userId !== userId) throw new ForbiddenException();
    if (restaurant.subExpiresAt && restaurant.subExpiresAt < new Date()) {
      throw new ForbiddenException('Захиалгын хугацаа дууссан. Багцаа сунгана уу.');
    }
    return restaurant;
  }
}
