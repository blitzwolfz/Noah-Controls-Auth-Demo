import { MiddlewareConsumer, Module, NestModule } from '@nestjs/common';
import { middleware } from 'supertokens-node/framework/express';
import { initSuperTokens } from './supertokens.config';
import { SuperTokensController } from './supertokens.controller';

initSuperTokens();

@Module({
  controllers: [SuperTokensController],
})
export class SuperTokensModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer.apply(middleware()).forRoutes('*');
  }
}
