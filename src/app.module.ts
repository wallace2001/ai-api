import { MiddlewareConsumer, Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { StripeModule } from './stripe/stripe.module';
import { WebhookModule } from './webhook/webhook.module';
import { ChatModule } from './chat/chat.module';
import { LimitModule } from './limit/limit.module';
import { LimitMiddleware } from './middlewares/limit.middleware';
import { ImageModule } from './image/image.module';
import { VideoModule } from './video/video.module';
import { AudioModule } from './audio/audio.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    LimitModule,
    ChatModule,
    ImageModule,
    VideoModule,
    AudioModule,
    StripeModule,
    WebhookModule,
  ],
})
export class AppModule {
  configure(consumer: MiddlewareConsumer) {
    consumer
      .apply(LimitMiddleware)
      .forRoutes('ai/chat');
  }
}