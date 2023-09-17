import { Module } from '@nestjs/common';
import { PrismaService } from 'src/prisma.service';
import { ImageController } from './image.controller';
import { ImageService } from './image.service';

@Module({
  imports: [],
  controllers: [ImageController],
  providers: [PrismaService, ImageService],
})
export class ImageModule {}