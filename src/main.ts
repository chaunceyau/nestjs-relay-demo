import { NestFactory } from '@nestjs/core';
import { PrismaClient } from '@prisma/client';
import { AppModule } from './app/app.module';

export const prisma = new PrismaClient({
  log: ['query'],
});

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  await app.listen(4200);
}
bootstrap();
