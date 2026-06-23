import { Controller, Get, Post, Patch, Delete, Param, Body, UseGuards } from '@nestjs/common';
import { JwtAuthGuard } from '../common/guards/jwt-auth.guard';
import { CurrentUser } from '../common/decorators/current-user.decorator';
import { SubscriptionsService } from './subscriptions.service';
import { UpgradeSubscriptionDto } from './subscriptions.dto';
import { QpayService } from '../payments/qpay.service';

@UseGuards(JwtAuthGuard)
@Controller('restaurants/:slug/subscription')
export class SubscriptionsController {
  constructor(
    private subscriptionsService: SubscriptionsService,
    private qpayService: QpayService,
  ) {}

  @Get()
  getCurrent(@Param('slug') slug: string, @CurrentUser('userId') userId: string) {
    return this.subscriptionsService.getCurrent(slug, userId);
  }

  @Post()
  startTrial(@Param('slug') slug: string, @CurrentUser('userId') userId: string) {
    return this.subscriptionsService.startTrial(slug, userId);
  }

  @Patch()
  upgrade(@Param('slug') slug: string, @CurrentUser('userId') userId: string, @Body() dto: UpgradeSubscriptionDto) {
    return this.subscriptionsService.upgrade(slug, userId, dto.tier);
  }

  @Delete()
  cancel(@Param('slug') slug: string, @CurrentUser('userId') userId: string) {
    return this.subscriptionsService.cancel(slug, userId);
  }

  @Get('invoices')
  getInvoices(@Param('slug') slug: string, @CurrentUser('userId') userId: string) {
    return this.subscriptionsService.getInvoices(slug, userId);
  }

  @Post('pay')
  payWithQpay(
    @Param('slug') slug: string,
    @CurrentUser('userId') userId: string,
    @Body() dto: UpgradeSubscriptionDto,
  ) {
    return this.qpayService.createInvoice(slug, userId, dto.tier);
  }
}
