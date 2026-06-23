import { Controller, Post, Req, Res } from '@nestjs/common';
import { Response } from 'express';
import { WireService } from './wire.service';
import { Public } from '../common/decorators/public.decorator';

@Controller('payments')
export class PaymentsController {
  constructor(private wireService: WireService) {}

  @Public()
  @Post('wire/webhook')
  async wireWebhook(@Req() req: any, @Res() res: Response) {
    const raw = req.rawBody
      ? Buffer.isBuffer(req.rawBody)
        ? req.rawBody.toString('utf-8')
        : String(req.rawBody)
      : JSON.stringify(req.body || {});

    const sig = req.headers?.['wirepayment-signature'] || '';
    const result = this.wireService.handleWebhook(raw, sig);
    return res.status(200).json(result);
  }
}
