import 'reflect-metadata';
import { NestFactory } from '@nestjs/core';
import cookieParser from 'cookie-parser';
import supertokens from 'supertokens-node';
import { SuperTokensExceptionFilter } from './supertokens/supertokens.filter';
import { ensureBetterAuthSchema } from './better-auth/better-auth.instance';
import { AppModule } from './app.module';

async function bootstrap() {
  await ensureBetterAuthSchema();

  const app = await NestFactory.create(AppModule, { bodyParser: true });

  const frontendOrigin = process.env.FRONTEND_ORIGIN || 'http://localhost:5173';

  app.enableCors({
    origin: [frontendOrigin],
    allowedHeaders: ['content-type', ...supertokens.getAllCORSHeaders()],
    credentials: true,
  });

  app.use(cookieParser());
  app.useGlobalFilters(new SuperTokensExceptionFilter());

  const port = Number(process.env.PORT || 4000);
  await app.listen(port);
  // eslint-disable-next-line no-console
  console.log(`Noah Controls auth demo API listening on http://localhost:${port}`);
}

bootstrap();
