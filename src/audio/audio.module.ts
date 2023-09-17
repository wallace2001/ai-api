import { Module } from '@nestjs/common';
import { PrismaService } from 'src/prisma.service';
import { AudioController } from './audio.controller';
import { AudioService } from './audio.service';

@Module({
  imports: [],
  controllers: [AudioController],
  providers: [PrismaService, AudioService],
})
export class AudioModule {}