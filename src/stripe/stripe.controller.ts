import {
    Controller,
    Get,
    Query,
    Res,
} from '@nestjs/common';
import { StripeService } from './stripe.service';
import { Response } from 'express';

export interface IOutputLink {
    url: string;
}

@Controller()
export class StripeController {
    constructor(
        private readonly stripeService: StripeService,
    ) { }

    @Get('stripe')
    async getUrlStripe(@Query('userId') userId: string, @Query('email') email: string, @Res() response: Response): Promise<IOutputLink> {
        return this.stripeService.paymentUrl(response, { userId, email });
    }
}