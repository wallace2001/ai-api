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
export class ChatService {
    private openai: OpenAI;

    constructor(private prisma: PrismaService) {
        this.openai = new OpenAI({
            apiKey: process.env.OPENAI_API_KEY
        });
    }

    async generateChatAiCompletion(req: Request, reply: Response): Promise<any> {
        const { userId, messages } = bodySchema.parse(req.body);

        try {
            if (!userId) {
                reply.status(401).send({ error: 'Unauthorized' });
            }

            if (!process.env.OPENAI_API_KEY) {
                reply.status(400).send({ error: "OpenAI API Key not configured" });
            }

            if (!messages) {
                reply.status(401).send({ error: "Messages are required" });
            }

            const freeTrial = await this.prisma.checkLimit(userId);

            if (!freeTrial) {
                return reply.status(403).send({error: 'Free trial expired.'});
            }
    
            await this.prisma.increaseLimit(userId);

            const response = await this.openai.chat.completions.create({
                model: 'gpt-3.5-turbo',
                messages: [introductionMessage, ...messages as any],
                stream: true,
            });

            const stream = OpenAIStream(response)

            streamToResponse(stream, reply, {
                headers: {
                    'Access-Control-Allow-Origin': '*',
                    'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS',
                }
            })
        } catch (error) {
            console.log(error);
            reply.status(500).send({ error: "Internal error" });
        }
    }
}