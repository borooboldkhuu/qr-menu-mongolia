import { Controller, Post, Req } from '@nestjs/common';
import { WireService } from './wire.service';
import { Public } from '../common/decorators/public.decorator';

@Controller('payments')
export class PaymentsController {
  constructor(private wireService: WireService) {}

  @Public()
  @Post('wire/webhook')
  async wireWebhook(@Req() req: any) {
    const raw = req.rawBody
      ? Buffer.isBuffer(req.rawBody)
        ? req.rawBody.toString('utf-8')
        : String(req.rawBody)
      : JSON.stringify(req.body || {});

    const sig = req.headers?.['wirepayment-signature'] || '';
    return this.wireService.handleWebhook(raw, sig);
  }
}
