import { Injectable, OnModuleInit } from '@nestjs/common';
import { PrismaClient } from '@prisma/client';
import { MAX_FREE_COUNTS } from '../constants';

@Injectable()
export class PrismaService extends PrismaClient implements OnModuleInit {
  async onModuleInit() {
    await this.$connect();
  }

  async checkLimit(userId: string) {
    const userLimit = await this.userApiLimit.findUnique({
      where: {
        userId
      }
    });

    return !userLimit || userLimit.count < MAX_FREE_COUNTS;
  }

  async increaseLimit(userId: string) {
    const userLimit = await this.userApiLimit.findUnique({
      where: {
        userId
      }
    });

    if (userLimit) {
      await this.userApiLimit.update({
        where: { userId },
        data: { count: userLimit.count + 1 }
      });
    } else {
      await this.userApiLimit.create({
        data: { userId, count: 1 }
      });
    }
  }
}