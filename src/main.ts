import { NestFactory } from '@nestjs/core';
import { AppModule } from './app/app.module';
import { ValidationPipe } from '@nestjs/common';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  // app.useGlobalPipes(new ValidationPipe());
  app.useGlobalPipes(new ValidationPipe({
    whitelist: true, // Remove propriedades não definidas no DTO
    forbidNonWhitelisted: true, // Retorna erro para propriedades não permitidas
    transform: false, // Transforma a entrada nos tipos especificados
  }));
  await app.listen(3000);
}
bootstrap();
