import { Injectable, NestMiddleware } from '@nestjs/common';
import { MAX_FREE_COUNTS } from '../../constants';
import { Request, Response, NextFunction } from 'express';
import { PrismaService } from 'src/prisma.service';

@Injectable()
export class LimitMiddleware implements NestMiddleware {
    async use(req: Request, res: Response, next: NextFunction) {

        next();
    }
}
