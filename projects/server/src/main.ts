import { NestFactory } from '@nestjs/core'
import { AppModule } from './app.module'
import cookieParser from 'cookie-parser'
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger'
import type { NextFunction, Request, Response } from 'express'

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
    exposedHeaders: ['Set-Cookie'],
    // Let Nest/Express handle OPTIONS automatically with 204 instead of
    // forwarding to route handlers (which can return 404 for preflights).
    preflightContinue: false,
    optionsSuccessStatus: 204
  })
  app.use('/api/public', (req: Request, res: Response, next: NextFunction) => {
    res.header('Access-Control-Allow-Origin', '*')
    res.header('Access-Control-Allow-Methods', 'GET,OPTIONS')
    res.header(
      'Access-Control-Allow-Headers',
      'Origin, X-Requested-With, Content-Type, Accept, Authorization'
    )
    res.header('Access-Control-Allow-Credentials', 'false')
    if (req.method === 'OPTIONS') {
      res.sendStatus(204)
      return
    }
    next()
  })

  await app.listen(process.env.PORT ?? 3000)
}

void bootstrap().catch(error => {
  console.error('Failed to bootstrap app', error)
  process.exit(1)
})
