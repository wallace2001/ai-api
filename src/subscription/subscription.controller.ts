import {
    Controller,
    Get,
    Param,
    Query,
    Res,
} from '@nestjs/common';
import { SubscriptionService } from './subscription.service';
import { Response } from 'express';

export interface IOutputLink {
    url: string;
}

@Controller()
export class SubscriptionController {
    constructor(
        private readonly subscriptionService: SubscriptionService,
    ) { }

    @Get('ckeck/subscription/:userId')
    async getUrlStripe(@Param('userId') userId: string, @Res() response: Response): Promise<Response> {
        return this.subscriptionService.checkSubscription(response, userId);
    }
}