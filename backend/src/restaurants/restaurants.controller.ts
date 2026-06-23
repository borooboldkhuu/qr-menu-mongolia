import {
  Controller,
  Get,
  Post,
  Patch,
  Delete,
  Body,
  Param,
  UseGuards,
  UseInterceptors,
  UploadedFile,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { JwtAuthGuard } from '../common/guards/jwt-auth.guard';
import { CurrentUser } from '../common/decorators/current-user.decorator';
import { RestaurantsService } from './restaurants.service';
import { CreateRestaurantDto, UpdateRestaurantDto } from './restaurants.dto';
import { UploadService } from '../upload/upload.service';

@UseGuards(JwtAuthGuard)
@Controller('restaurants')
export class RestaurantsController {
  constructor(
    private restaurantsService: RestaurantsService,
    private uploadService: UploadService,
  ) {}

  @Get()
  findAll(@CurrentUser('userId') userId: string) {
    return this.restaurantsService.findAll(userId);
  }

  @Post()
  create(
    @CurrentUser('userId') userId: string,
    @Body() dto: CreateRestaurantDto,
  ) {
    return this.restaurantsService.create(userId, dto);
  }

  @Get(':slug')
  findBySlug(
    @Param('slug') slug: string,
    @CurrentUser('userId') userId: string,
  ) {
    return this.restaurantsService.findBySlug(slug, userId);
  }

  @Patch(':slug')
  update(
    @Param('slug') slug: string,
    @CurrentUser('userId') userId: string,
    @Body() dto: UpdateRestaurantDto,
  ) {
    return this.restaurantsService.update(slug, userId, dto);
  }

  @Patch(':slug/logo')
  @UseInterceptors(FileInterceptor('file'))
  async uploadLogo(
    @Param('slug') slug: string,
    @CurrentUser('userId') userId: string,
    @UploadedFile() file: Express.Multer.File,
  ) {
    const result = await this.uploadService.uploadImage(file, 'logos');
    return this.restaurantsService.updateLogo(slug, userId, result.url);
  }

  @Patch(':slug/cover')
  @UseInterceptors(FileInterceptor('file'))
  async uploadCover(
    @Param('slug') slug: string,
    @CurrentUser('userId') userId: string,
    @UploadedFile() file: Express.Multer.File,
  ) {
    const result = await this.uploadService.uploadImage(file, 'covers');
    return this.restaurantsService.updateCover(slug, userId, result.url);
  }

  @Delete(':slug')
  remove(
    @Param('slug') slug: string,
    @CurrentUser('userId') userId: string,
  ) {
    return this.restaurantsService.remove(slug, userId);
  }
}
