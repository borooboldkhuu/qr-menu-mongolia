import { Module } from '@nestjs/common';
import { PaymentsController } from './payments.controller';
import { WireService } from './wire.service';

@Module({
  controllers: [PaymentsController],
  providers: [WireService],
  exports: [WireService],
})
export class PaymentsModule {}
