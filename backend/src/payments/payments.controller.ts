import { Controller, Post, Body, Headers, Req, RawBodyRequest } from '@nestjs/common';
import { Request } from 'express';
import { QpayService } from './qpay.service';
import { Public } from '../common/decorators/public.decorator';

@Controller('payments')
export class PaymentsController {
  constructor(private qpayService: QpayService) {}

  @Public()
  @Post('qpay/callback')
  async callback(
    @Req() req: RawBodyRequest<Request>,
    @Headers('wirepayment-signature') signature: string,
  ) {
    const rawBody = (req as any).rawBody?.toString() || JSON.stringify(req.body);
    return this.qpayService.handleCallback(rawBody, signature);
  }
}
