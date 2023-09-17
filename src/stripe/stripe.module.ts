import { Module } from '@nestjs/common';
import { StripeController } from './stripe.controller';
import { StripeService } from './stripe.service';
import { PrismaService } from 'src/prisma.service';

@Module({
  controllers: [StripeController],
  providers: [PrismaService, StripeService],
})
export class StripeModule {}