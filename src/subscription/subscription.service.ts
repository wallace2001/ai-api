import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma.service';
import { absoluteUrl } from 'src/utils/absoluteURL';
import { Response } from 'express';

const settingsUrl = absoluteUrl('/settings');

@Injectable()
export class SubscriptionService {

    constructor(private prisma: PrismaService) {}

    async checkSubscription(reply: Response, userId: string): Promise<Response> {
        try {
            if (!userId) {
                return reply.status(401).send({ permission: false });
            }

            const permission = await this.prisma.checkSubscription(userId);

            return reply.status(200).send({ permission })
        } catch (error) {
            console.log(error);
            reply.status(500).send({ error: "Internal error" });
        }
    }
}