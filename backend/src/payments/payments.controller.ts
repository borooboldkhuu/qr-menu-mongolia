import { Controller, Post, Headers, Req, RawBodyRequest } from '@nestjs/common';
import { WireService } from './wire.service';
import { Public } from '../common/decorators/public.decorator';

@Controller('payments')
export class PaymentsController {
  constructor(private wireService: WireService) {}

  /**
   * Wire webhook endpoint
   */
  @Public()
  @Post('wire/webhook')
  async wireWebhook(
    @Req() req: RawBodyRequest<Request>,
    @Headers('wirepayment-signature') signature: string,
  ) {
    let raw = '';
    try {
      if (Buffer.isBuffer((req as any).rawBody)) {
        raw = ((req as any).rawBody as Buffer).toString('utf-8');
      } else if (typeof (req as any).rawBody === 'string') {
        raw = (req as any).rawBody;
      } else {
        raw = JSON.stringify(req.body || {});
      }
    } catch {
      raw = '{}';
    }
    return this.wireService.handleWebhook(raw, signature || '');
  }
}
