import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';
import { NestExpressApplication } from '@nestjs/platform-express';
import { join } from 'path';
const cookieParser = require('cookie-parser');
import * as fs from 'fs';

async function bootstrap() {
  const app = await NestFactory.create<NestExpressApplication>(AppModule);

  // ✅ Ensure 'api/uploads/users' exists
  const uploadsDir = join(__dirname, '..', '..', 'uploads', 'users');
  if (!fs.existsSync(uploadsDir)) {
    fs.mkdirSync(uploadsDir, { recursive: true });
    console.log(`✅ Created directory: ${uploadsDir}`);
  }

  // Enable static assets
  app.useStaticAssets(join(__dirname, '..', 'uploads'), {
    prefix: '/uploads/',
  });

  // ✅ Enable CORS
  app.use(cookieParser());

  app.enableCors({
    origin: [
      'http://localhost:3000', // local dev
      'https://dev.lightningq.com', // dev frontend (Vercel)
      'https://ai.lightningq.com', // production frontend
      "http://127.0.0.1:3000"
    ], 
     methods: ['GET', 'POST', 'PATCH', 'PUT', 'DELETE', 'OPTIONS'],
    credentials: true,
  });

  // Global pipes
  app.useGlobalPipes(
    new ValidationPipe({
      transform: true,
      whitelist: true,
      forbidNonWhitelisted: true, // Optional but useful
      enableDebugMessages: true,
    }),
  );

  // Logging middleware
  app.use((req, res, next) => {
    console.log(`[REQUEST] ${req.method} ${req.url}`);
    console.log('Cookies has been log:', req.headers.cookie);
    if (req.url.includes('Updateprofile')) {
      console.log('🔒 Updateprofile request cookies:', req.cookies);
    }
    next();
  });

  await app.listen(process.env.PORT ?? 8000);
  console.log(
    `🚀 Server ready on http://localhost:${process.env.PORT ?? 8000}`,
  );
}
bootstrap();
