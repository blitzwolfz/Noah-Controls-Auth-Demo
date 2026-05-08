import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { KeycloakModule } from './keycloak/keycloak.module';
import { SuperTokensModule } from './supertokens/supertokens.module';
import { BetterAuthModule } from './better-auth/better-auth.module';
import { HealthController } from './health.controller';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    KeycloakModule,
    SuperTokensModule,
    BetterAuthModule,
  ],
  controllers: [HealthController],
})
export class AppModule {}
