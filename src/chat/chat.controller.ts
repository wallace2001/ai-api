import {
    Controller,
    Post,
    Req,
    Res,
} from '@nestjs/common';
import { ChatService } from './chat.service';
import { Response } from 'express';

export interface IOutputLink {
    url: string;
}

@Controller()
export class ChatController {
    constructor(
        private readonly chatService: ChatService,
    ) { }

    @Post('ai/chat')
    async getUrlStripe(@Req() request: Request, @Res() response: Response): Promise<IOutputLink> {
        return this.chatService.generateChatAiCompletion(request, response);
    }
}