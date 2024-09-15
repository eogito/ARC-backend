// src/main.ts

import { NestFactory } from '@nestjs/core'
import { AppModule } from './app.module'
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger'
import { ValidationPipe } from '@nestjs/common'
// import * as passport from 'passport'

async function bootstrap() {
  const app = await NestFactory.create(AppModule)
  app.setGlobalPrefix('api')
  app.useGlobalPipes(new ValidationPipe({ whitelist: true }))

  const config = new DocumentBuilder()
    .setTitle('Demo API')
    .setDescription('The Demo API description')
    .setVersion('1')
    .addBearerAuth({
      type: 'http',
      scheme: 'Bearer',
      bearerFormat: 'JWT',
      in: 'header'
    }, 'JWT')
    .build()
  const document = SwaggerModule.createDocument(app, config)
  SwaggerModule.setup('api', app, document)

  if (process.env.LOCAL && process.env.LOCAL === 'true') {
    const corsConfig = {
      exposedHeaders: ['Authorization', 'X-Total-Count']
    }

    app.enableCors(corsConfig)
  }
  await app.listen(3000)
}
bootstrap()
