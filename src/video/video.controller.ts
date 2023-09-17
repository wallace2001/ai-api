import {
    Controller,
    Post,
    Req,
    Res,
} from '@nestjs/common';
import { Response } from 'express';
import { VideoService } from './video.service';

export interface IOutputLink {
    url: string;
}

@Controller()
export class VideoController {
    constructor(
        private readonly videoService: VideoService,
    ) { }

    @Post('ai/video')
    async videoGenerate(@Req() request: Request, @Res() response: Response): Promise<IOutputLink> {
        return this.videoService.generateVideoAiCompletion(request, response);
    }
}