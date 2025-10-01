import { NestFactory } from '@nestjs/core'
import { AppModule } from './app.module'
import cookieParser from 'cookie-parser'
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger'

async function bootstrap() {
  const app = await NestFactory.create(AppModule)

  const config = new DocumentBuilder()
    .setTitle('Lemnity API')
    .setDescription('The Lemnity API description')
    .setVersion('1.0')
    .addTag('lemnity')
    .addServer(process.env.API_URL || '/api')
    .build()
  const documentFactory = () => SwaggerModule.createDocument(app, config)
  SwaggerModule.setup('docs', app, documentFactory)

  app.setGlobalPrefix('api')
  app.use(cookieParser())
  app.enableCors({
    origin: process.env.FRONTEND_URL,
    credentials: true,
    exposedHeaders: ['Set-Cookie']
  })

  await app.listen(process.env.PORT ?? 3000)
}

bootstrap()
