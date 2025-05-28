import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';
import { NestExpressApplication } from '@nestjs/platform-express';
import { join } from 'path';
const cookieParser = require('cookie-parser');


async function bootstrap() {
  const app = await NestFactory.create<NestExpressApplication>(AppModule);

  // Enable static assets
  app.useStaticAssets(join(__dirname, '..', 'uploads'), {
    prefix: '/uploads/',
  });

  // ✅ Enable CORS
  app.use(cookieParser()); 

  app.enableCors({
    origin: 'http://localhost:3000', // Replace with your frontend URL
    credentials: true,
  });

  // Global pipes
  app.useGlobalPipes(
    new ValidationPipe({
      transform: true,
      whitelist: true,
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
}
bootstrap();
