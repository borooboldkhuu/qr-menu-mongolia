import { Controller, Post, Body, Headers, Req, RawBodyRequest } from '@nestjs/common';
import { Request } from 'express';
import { WireService } from './wire.service';
import { Public } from '../common/decorators/public.decorator';

@Controller('payments')
export class PaymentsController {
  constructor(private wireService: WireService) {}

  /**
   * Wire webhook endpoint
   * IP whitelist: 65.109.117.186
   * HMAC-SHA256 signature шалгана
   */
  @Public()
  @Post('wire/webhook')
  async wireWebhook(
    @Req() req: RawBodyRequest<Request>,
    @Headers('wirepayment-signature') signature: string,
  ) {
    const rawBody = (req as any).rawBody?.toString() || JSON.stringify(req.body);
    return this.wireService.handleWebhook(rawBody, signature || '');
  }
}
