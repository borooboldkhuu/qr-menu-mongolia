import { Controller, Get, Param, UseGuards, Query } from '@nestjs/common';
import { JwtAuthGuard } from '../common/guards/jwt-auth.guard';
import { CurrentUser } from '../common/decorators/current-user.decorator';
import { AnalyticsService } from './analytics.service';

@UseGuards(JwtAuthGuard)
@Controller('restaurants/:slug/analytics')
export class AnalyticsController {
  constructor(private analyticsService: AnalyticsService) {}

  @Get()
  getDashboard(@Param('slug') slug: string, @CurrentUser('userId') userId: string) {
    return this.analyticsService.getDashboard(slug, userId);
  }

  @Get('scans/daily')
  getScansByDay(@Param('slug') slug: string, @CurrentUser('userId') userId: string, @Query('days') days?: number) {
    return this.analyticsService.getScansByDay(slug, userId, days || 30);
  }

  @Get('devices')
  getDeviceBreakdown(@Param('slug') slug: string, @CurrentUser('userId') userId: string) {
    return this.analyticsService.getDeviceBreakdown(slug, userId);
  }
}
