import { Controller, Post, Req, Res, HttpCode, Get } from '@nestjs/common';
import { Response } from 'express';
import { WireService } from './wire.service';
import { Public } from '../common/decorators/public.decorator';

@Controller('payments')
export class PaymentsController {
  constructor(private wireService: WireService) {}

  @Public()
  @Get('wire/webhook')
  getWebhook(@Res() res: Response) {
    return res.status(200).json({ ok: true });
  }

  @Public()
  @Post('wire/webhook')
  @HttpCode(200)
  async wireWebhook(@Req() req: any, @Res({ passthrough: false }) res: Response) {
    let raw = '{}';
    try {
      if (Buffer.isBuffer(req.rawBody)) {
        raw = req.rawBody.toString('utf-8');
      } else if (typeof req.rawBody === 'string') {
        raw = req.rawBody;
      } else if (req.body) {
        raw = JSON.stringify(req.body);
      }
    } catch {}

    const sig = (req.headers?.['wirepayment-signature'] || '') as string;
    const result = this.wireService.handleWebhook(raw, sig);
    res.status(200).json(result);
    return;
  }
}
