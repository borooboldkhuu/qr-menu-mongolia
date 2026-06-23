import { Controller, Get, Post, Patch, Delete, Body, Param, Query, UseGuards, UseInterceptors, UploadedFile } from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { JwtAuthGuard } from '../common/guards/jwt-auth.guard';
import { CurrentUser } from '../common/decorators/current-user.decorator';
import { MenuItemsService } from './menu-items.service';
import { CreateMenuItemDto, UpdateMenuItemDto } from './menu-items.dto';
import { UploadService } from '../upload/upload.service';

@UseGuards(JwtAuthGuard)
@Controller('restaurants/:slug/items')
export class MenuItemsController {
  constructor(
    private menuItemsService: MenuItemsService,
    private uploadService: UploadService,
  ) {}

  @Get()
  findAll(
    @Param('slug') slug: string,
    @CurrentUser('userId') userId: string,
    @Query('categoryId') categoryId?: string,
  ) {
    return this.menuItemsService.findAll(slug, userId, categoryId);
  }

  @Post()
  create(@Param('slug') slug: string, @CurrentUser('userId') userId: string, @Body() dto: CreateMenuItemDto) {
    return this.menuItemsService.create(slug, userId, dto);
  }

  @Patch(':id')
  update(@Param('slug') slug: string, @Param('id') id: string, @CurrentUser('userId') userId: string, @Body() dto: UpdateMenuItemDto) {
    return this.menuItemsService.update(slug, userId, id, dto);
  }

  @Delete(':id')
  remove(@Param('slug') slug: string, @Param('id') id: string, @CurrentUser('userId') userId: string) {
    return this.menuItemsService.remove(slug, userId, id);
  }

  @Patch(':id/toggle')
  toggle(@Param('slug') slug: string, @Param('id') id: string, @CurrentUser('userId') userId: string) {
    return this.menuItemsService.toggleAvailability(slug, userId, id);
  }

  @Patch(':id/image')
  @UseInterceptors(FileInterceptor('file'))
  async uploadImage(
    @Param('slug') slug: string,
    @Param('id') id: string,
    @CurrentUser('userId') userId: string,
    @UploadedFile() file: Express.Multer.File,
  ) {
    const result = await this.uploadService.uploadImage(file, 'menu-items');
    return this.menuItemsService.updateImage(slug, userId, id, result.url);
  }
}
