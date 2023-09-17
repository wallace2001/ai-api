import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma.service';
import { Response } from 'express';
import { bodySchema } from './schema';
import Replicate from 'replicate';

@Injectable()
export class VideoService {

    constructor(private prisma: PrismaService) {}

    async generateVideoAiCompletion(req: Request, reply: Response): Promise<any> {
        const { userId, prompt } = bodySchema.parse(req.body);

        try {

            const replicate = new Replicate({
                auth: process.env.REPLICATE_API_TOKEN!
            });

            if (!userId) {
                return reply.status(401).send({ error: 'Unauthorized' });
            }

            if (!process.env.REPLICATE_API_TOKEN) {
                return reply.status(400).send({ error: "Replicate API Key not configured" });
            }

            if (!prompt) {
                return reply.status(401).send({ error: "Prompt are required" });
            }

            const freeTrial = await this.prisma.checkLimit(userId);

            if (!freeTrial) {
                return reply.status(403).send({error: 'Free trial expired.'});
            }
    
            await this.prisma.increaseLimit(userId);

            const response = await replicate.run(
                "anotherjesse/zeroscope-v2-xl:9f747673945c62801b13b84701c783929c0ee784e4748ec062204894dda1a351",
                {
                  input: {
                    prompt: prompt
                  }
                }
              );

            return reply.send(response);
        } catch (error) {
            console.log(error);
            reply.status(500).send({ error: "Internal error" });
        }
    }
}