import { IsEnum } from 'class-validator';
import { SubscriptionTier } from '@prisma/client';

export class UpgradeSubscriptionDto {
  @IsEnum(SubscriptionTier, { message: 'Starter, Pro эсвэл Enterprise байх ёстой' })
  tier: SubscriptionTier;
}
