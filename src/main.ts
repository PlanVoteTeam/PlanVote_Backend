import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import helmet from 'helmet';

async function bootstrap() {
  const app = await NestFactory.create(AppModule, {
    cors: {
      origin: '*',
      methods: ['GET', 'HEAD', 'PUT', 'PATCH', 'POST', 'DELETE'],
      allowedHeaders: [
        'Content-Type',
        'X-CSRF-TOKEN',
        'Access-Control-Allow-Methods',
        'Access-Control-Allow-Origin',
        'Access-Control-Allow-Credentials',
        'Access-control-allow-headers',
      ],
    },
  });
  // app.enableCors({
  //   origin: ['http://localhost:5173', 'https://planvote.netlify.app/'],
  //   methods: ['GET', 'HEAD', 'PUT', 'PATCH', 'POST', 'DELETE'],
  //   allowedHeaders: [
  //     'Content-Type',
  //     'X-CSRF-TOKEN',
  //     'Access-Control-Allow-Methods',
  //     'Access-Control-Allow-Origin',
  //     'Access-Control-Allow-Credentials',
  //     'Access-control-allow-headers',
  //   ],
  // });
  app.use(helmet());
  await app.listen(3000);
}
bootstrap();
