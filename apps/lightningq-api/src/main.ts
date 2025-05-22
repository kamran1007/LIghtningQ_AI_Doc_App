import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  await app.listen(process.env.PORT ?? 8000);
  app.use((req, res, next) => {
    console.log(`[REQUEST] ${req.method} ${req.url}`);
    next();
  });
  app.setGlobalPrefix('api'); // <-- common case

  app.useGlobalPipes(
    new ValidationPipe({
      transform: true,
      whitelist: true,
      
    }),
  );
}
bootstrap();
