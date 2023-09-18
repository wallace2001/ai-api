import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma.service';
import { absoluteUrl } from 'src/utils/absoluteURL';
import { Response } from 'express';

const settingsUrl = absoluteUrl('/settings');

@Injectable()
export class LimitService {

    constructor(private prisma: PrismaService) {}

    async getCountLimitUsageAI(reply: Response, userId: string): Promise<Response> {
        try {
            if (!userId) {
                return reply.status(200).send({ count: 0, permission: false });
            }
        
            const userLimit = await this.prisma.userApiLimit.findUnique({
                where: {
                    userId
                }
            });
            if (!userLimit) {
                return reply.status(200).send({ count: 0, permission: false });
            }

            const permission = await this.prisma.checkSubscription(userId);

            return reply.status(200).send({ count: userLimit.count, permission })
        } catch (error) {
            console.log(error);
            reply.status(500).send({ error: "Internal error" });
        }
    }
}