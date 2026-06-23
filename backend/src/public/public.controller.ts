import { Controller, Get, Post, Param, Query, Req, Ip, Headers } from '@nestjs/common';
import { Public } from '../common/decorators/public.decorator';
import { PublicService } from './public.service';
import { AnalyticsService } from '../analytics/analytics.service';

@Controller('public')
export class PublicController {
  constructor(
    private publicService: PublicService,
    private analyticsService: AnalyticsService,
  ) {}

  @Public()
  @Get(':slug')
  getMenu(@Param('slug') slug: string) {
    return this.publicService.getMenu(slug);
  }

  @Public()
  @Get(':slug/categories')
  getCategories(@Param('slug') slug: string) {
    return this.publicService.getCategories(slug);
  }

  @Public()
  @Get(':slug/items')
  getItems(
    @Param('slug') slug: string,
    @Query('search') search?: string,
    @Query('categoryId') categoryId?: string,
  ) {
    return this.publicService.getItems(slug, search, categoryId);
  }

  @Public()
  @Get(':slug/menu')
  getMenuFull(@Param('slug') slug: string) {
    return this.publicService.getItemsGrouped(slug);
  }

  @Public()
  @Post(':slug/scan')
  trackScan(
    @Param('slug') slug: string,
    @Query('qrCodeId') qrCodeId: string,
    @Headers('user-agent') userAgent?: string,
    @Ip() ipAddress?: string,
  ) {
    return this.analyticsService.trackScan(slug, qrCodeId, userAgent, ipAddress);
  }
}
