import { Controller, Get, Post, Patch, Delete, Body, Param, UseGuards } from '@nestjs/common';
import { JwtAuthGuard } from '../common/guards/jwt-auth.guard';
import { CurrentUser } from '../common/decorators/current-user.decorator';
import { CategoriesService } from './categories.service';
import { CreateCategoryDto, UpdateCategoryDto, ReorderCategoriesDto } from './categories.dto';

@UseGuards(JwtAuthGuard)
@Controller('restaurants/:slug/categories')
export class CategoriesController {
  constructor(private categoriesService: CategoriesService) {}

  @Get()
  findAll(@Param('slug') slug: string, @CurrentUser('userId') userId: string) {
    return this.categoriesService.findAll(slug, userId);
  }

  @Post()
  create(@Param('slug') slug: string, @CurrentUser('userId') userId: string, @Body() dto: CreateCategoryDto) {
    return this.categoriesService.create(slug, userId, dto);
  }

  @Patch(':id')
  update(@Param('slug') slug: string, @Param('id') id: string, @CurrentUser('userId') userId: string, @Body() dto: UpdateCategoryDto) {
    return this.categoriesService.update(slug, userId, id, dto);
  }

  @Delete(':id')
  remove(@Param('slug') slug: string, @Param('id') id: string, @CurrentUser('userId') userId: string) {
    return this.categoriesService.remove(slug, userId, id);
  }

  @Patch('reorder')
  reorder(@Param('slug') slug: string, @CurrentUser('userId') userId: string, @Body() dto: ReorderCategoriesDto) {
    return this.categoriesService.reorder(slug, userId, dto.ids);
  }
}
