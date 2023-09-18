import { MiddlewareConsumer, Module, RequestMethod } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { StripeModule } from './stripe/stripe.module';
import { WebhookModule } from './webhook/webhook.module';
import { ChatModule } from './chat/chat.module';
import { LimitModule } from './limit/limit.module';
import { ImageModule } from './image/image.module';
import { VideoModule } from './video/video.module';
import { AudioModule } from './audio/audio.module';
import { SubscriptionModule } from './subscription/subscription.module';
import { RawBodyMiddleware } from './middlewares/raw-body.middleware';
import { JsonBodyMiddleware } from './middlewares/json-body.middleware';

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
    SubscriptionModule,
    StripeModule,
    WebhookModule,
  ],
})
export class AppModule {
  configure(consumer: MiddlewareConsumer) {
    consumer
      .apply(RawBodyMiddleware)
      .forRoutes({
        path: '/webhook',
        method: RequestMethod.POST,
      })
      .apply(JsonBodyMiddleware)
      .forRoutes('*');
  }
}