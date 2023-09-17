import {
    Controller,
    Post,
    Req,
    Res,
} from '@nestjs/common';
import { Response } from 'express';
import { AudioService } from './audio.service';

export interface IOutputLink {
    url: string;
}

@Controller()
export class AudioController {
    constructor(
        private readonly audioService: AudioService,
    ) { }

    @Post('ai/music')
    async AudioGenerate(@Req() request: Request, @Res() response: Response): Promise<IOutputLink> {
        return this.audioService.generateAudioAiCompletion(request, response);
    }
}