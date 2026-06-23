import { Controller, Get, Post, Delete, Param, Res, UseGuards } from '@nestjs/common';
import { Response } from 'express';
import { JwtAuthGuard } from '../common/guards/jwt-auth.guard';
import { CurrentUser } from '../common/decorators/current-user.decorator';
import { QrCodesService } from './qr-codes.service';

@UseGuards(JwtAuthGuard)
@Controller('restaurants/:slug/qr-codes')
export class QrCodesController {
  constructor(private qrCodesService: QrCodesService) {}

  @Get()
  findAll(@Param('slug') slug: string, @CurrentUser('userId') userId: string) {
    return this.qrCodesService.findAll(slug, userId);
  }

  @Post()
  create(@Param('slug') slug: string, @CurrentUser('userId') userId: string) {
    return this.qrCodesService.create(slug, userId);
  }

  @Get(':id/png')
  async getPng(@Param('slug') slug: string, @Param('id') id: string, @CurrentUser('userId') userId: string, @Res() res: Response) {
    const dataUrl = await this.qrCodesService.getPng(slug, userId, id);
    const base64 = dataUrl!.split(',')[1];
    const buffer = Buffer.from(base64, 'base64');
    res.setHeader('Content-Type', 'image/png');
    res.setHeader('Content-Disposition', 'attachment; filename="qr-code.png"');
    res.send(buffer);
  }

  @Get(':id/svg')
  async getSvg(@Param('slug') slug: string, @Param('id') id: string, @CurrentUser('userId') userId: string, @Res() res: Response) {
    const svg = await this.qrCodesService.getSvg(slug, userId, id);
    res.setHeader('Content-Type', 'image/svg+xml');
    res.setHeader('Content-Disposition', 'attachment; filename="qr-code.svg"');
    res.send(svg);
  }

  @Delete(':id')
  remove(@Param('slug') slug: string, @Param('id') id: string, @CurrentUser('userId') userId: string) {
    return this.qrCodesService.remove(slug, userId, id);
  }
}
