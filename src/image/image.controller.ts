import {
    Controller,
    Post,
    Req,
    Res,
} from '@nestjs/common';
import { ImageService } from './image.service';
import { Response } from 'express';

export interface IOutputLink {
    url: string;
}

@Controller()
export class ImageController {
    constructor(
        private readonly imageService: ImageService,
    ) { }

    @Post('ai/image')
    async getUrlStripe(@Req() request: Request, @Res() response: Response): Promise<IOutputLink> {
        return this.imageService.generateImageAiCompletion(request, response);
    }
}