import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma.service';
import { Response } from 'express';
import { bodySchema } from './schema';
import Replicate from 'replicate';

@Injectable()
export class AudioService {

    constructor(private prisma: PrismaService) {}

    async generateAudioAiCompletion(req: Request, reply: Response): Promise<any> {
        const { userId, prompt } = bodySchema.parse(req.body);

        try {

            const replicate = new Replicate({
                auth: process.env.REPLICATE_API_TOKEN!
            });

            if (!userId) {
                return reply.status(401).send({ error: 'Unauthorized' });
            }

            if (!process.env.OPENAI_API_KEY) {
                return reply.status(400).send({ error: "OpenAI API Key not configured" });
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
                "riffusion/riffusion:8cf61ea6c56afd61d8f5b9ffd14d7c216c0a93844ce2d82ac1c9ecc9c7f24e05",
                {
                    input: {
                        prompt_a: prompt
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