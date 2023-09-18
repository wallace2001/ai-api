import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma.service';
import { Response } from 'express';
import Stripe from 'stripe';
import { bodySchema } from './schema';
import { streamToResponse, OpenAIStream } from 'ai';
import OpenAI from 'openai';

const introductionMessage = {
    role: 'system',
    content: "You are a code generator. You must answer only in markdown code snippets. Use code comments for explanations."
};

@Injectable()
export class ImageService {
    private openai: OpenAI;

    constructor(private prisma: PrismaService) {
        this.openai = new OpenAI({
            apiKey: process.env.OPENAI_API_KEY
        });
    }

    async generateImageAiCompletion(req: Request, reply: Response): Promise<any> {
        const { userId, prompt, resolution, amount } = bodySchema.parse(req.body);

        try {
            if (!userId) {
                return reply.status(401).send({ error: 'Unauthorized' });
            }

            if (!process.env.OPENAI_API_KEY) {
                return reply.status(400).send({ error: "OpenAI API Key not configured" });
            }

            if (!prompt) {
                return reply.status(401).send({ error: "Prompt are required" });
            }

            if (!amount) {
                return reply.status(401).send({ error: "Amount are required" });
            }

            if (!resolution) {
                return reply.status(401).send({ error: "Resolution are required" });
            }

            const freeTrial = await this.prisma.checkLimit(userId);
            const isPro = await this.prisma.checkSubscription(userId);

            if (!freeTrial && !isPro) {
                return reply.status(403).send({error: 'Free trial expired.'});
            }
            
            if (!isPro) {
                await this.prisma.increaseLimit(userId);
            }

            const response = await this.openai.images.generate({
                prompt,
                n: parseInt(amount, 10),
                size: resolution as any,
            })

            return reply.status(200).send(response.data);
        } catch (error) {
            console.log(error);
            reply.status(500).send({ error: "Internal error" });
        }
    }
}