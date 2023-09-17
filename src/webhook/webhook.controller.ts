import {
    Controller,
    Post,
    Req,
    Res,
} from '@nestjs/common';
import { WebhookService } from './webhook.service';
import { Response } from 'express';

export interface IOutputLink {
    url: string;
}

@Controller()
export class WebhookController {
    constructor(
        private readonly webhookService: WebhookService,
    ) { }

    @Post('webhook')
    async webhook(@Req() request: Request, @Res() response: Response): Promise<void> {

        this.webhookService.webhookStripe(request, response);
    }
}