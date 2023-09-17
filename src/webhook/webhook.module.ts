import { Module } from '@nestjs/common';

import { PrismaService } from 'src/prisma.service';
import { WebhookController } from './webhook.controller';
import { WebhookService } from './webhook.service';

@Module({
  controllers: [WebhookController],
  providers: [PrismaService, WebhookService],
})
export class WebhookModule {}