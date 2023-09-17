import { Module } from '@nestjs/common';
import { PrismaService } from 'src/prisma.service';
import { ChatController } from './chat.controller';
import { ChatService } from './chat.service';

@Module({
  imports: [],
  controllers: [ChatController],
  providers: [PrismaService, ChatService],
})
export class ChatModule {}