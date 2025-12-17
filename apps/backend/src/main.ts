import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { Logger, ValidationPipe } from '@nestjs/common';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { apiReference } from '@scalar/nestjs-api-reference';
import { Transform } from 'class-transformer';

async function bootstrap() {
  const logger = new Logger('Bootstrap');
  const app = await NestFactory.create(AppModule, {
    logger: ['error', 'warn', 'log', 'debug', 'verbose'],
  });
  app.enableCors({

    origin: [
      process.env.CLIENT_URL,
      'http://localhost:3000',
    ].filter(Boolean),
    methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',
    credentials: true,
    allowedHeaders: 'Content-Type, Authorization',
  });
  app.useGlobalPipes(new ValidationPipe({ transform: true, whitelist: true }));
  app.setGlobalPrefix('v1');
  const config = new DocumentBuilder()
    .setTitle('Renewly API')
    .setDescription('The Renewly API description')
    .setVersion('1.0')
    .build();

  const docs = SwaggerModule.createDocument(app, config);

  app.use('/reference', apiReference({ content: docs }));

  await app.listen(process.env.PORT ?? 3000);

  logger.log(
    `Swagger is running on http://localhost:${process.env.PORT}/reference`,
  );
}
bootstrap();
