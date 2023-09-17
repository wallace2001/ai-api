import {
    Controller,
    Get,
    Param,
    Query,
    Res,
} from '@nestjs/common';
import { LimitService } from './limit.service';
import { Response } from 'express';

export interface IOutputLink {
    url: string;
}

@Controller()
export class LimitController {
    constructor(
        private readonly limitService: LimitService,
    ) { }

    @Get('ai/limit/:userId')
    async getUrlStripe(@Param('userId') userId: string, @Res() response: Response): Promise<Response> {
        return this.limitService.getCountLimitUsageAI(response, userId);
    }
}