import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule, {
    bodyParser: false
  });

  app.enableCors({
    origin: '*',
    methods: ["GET", "POST", "PUT", "PATCH", "DELETE", "UPDATE", "OPTIONS"]
  });

  await app.listen(3333);
}
bootstrap();
