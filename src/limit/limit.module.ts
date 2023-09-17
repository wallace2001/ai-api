import { Module } from '@nestjs/common';
import { PrismaService } from 'src/prisma.service';
import { LimitController } from './limit.controller';
import { LimitService } from './limit.service';

@Module({
  controllers: [LimitController],
  providers: [PrismaService, LimitService],
})
export class LimitModule {}