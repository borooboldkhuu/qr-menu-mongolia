import { Module } from '@nestjs/common';
import { PaymentsController } from './payments.controller';
import { QpayService } from './qpay.service';

@Module({
  controllers: [PaymentsController],
  providers: [QpayService],
  exports: [QpayService],
})
export class PaymentsModule {}
