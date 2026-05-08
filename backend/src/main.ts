import 'reflect-metadata';
import { NestFactory } from '@nestjs/core';
import { ValidationPipe } from '@nestjs/common';
import cookieParser from 'cookie-parser';
import supertokens from 'supertokens-node';
import { SuperTokensExceptionFilter } from './supertokens/supertokens.filter';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule, { bodyParser: true });

  const frontendOrigin = process.env.FRONTEND_ORIGIN || 'http://localhost:5173';

  app.enableCors({
    origin: [frontendOrigin],
    allowedHeaders: ['content-type', ...supertokens.getAllCORSHeaders()],
    credentials: true,
  });

  app.use(cookieParser());
  app.useGlobalPipes(new ValidationPipe({ transform: true, whitelist: true }));
  app.useGlobalFilters(new SuperTokensExceptionFilter());

  const port = Number(process.env.PORT || 4000);
  await app.listen(port);
  // eslint-disable-next-line no-console
  console.log(`Noah Controls auth demo API listening on http://localhost:${port}`);
}

bootstrap();
