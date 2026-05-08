import { Body, Controller, Get, Headers, Post, UnauthorizedException } from '@nestjs/common';
import { KeycloakService } from './keycloak.service';

@Controller('api/keycloak')
export class KeycloakController {
  constructor(private readonly keycloak: KeycloakService) {}

  @Post('signup')
  async signup(@Body() body: { email: string; password: string; firstName?: string; lastName?: string }) {
    await this.keycloak.register(body.email, body.password, body.firstName, body.lastName);
    const tokens = await this.keycloak.login(body.email, body.password);
    return { ok: true, tokens };
  }

  @Post('login')
  async login(@Body() body: { email: string; password: string }) {
    const tokens = await this.keycloak.login(body.email, body.password);
    return { ok: true, tokens };
  }

  @Get('profile')
  async profile(@Headers('authorization') authHeader?: string) {
    if (!authHeader || !authHeader.toLowerCase().startsWith('bearer ')) {
      throw new UnauthorizedException('Missing bearer token');
    }
    const token = authHeader.slice(7);
    const info = await this.keycloak.userInfo(token);
    return {
      provider: 'keycloak',
      user: {
        id: info.sub,
        email: info.email,
        name: [info.given_name, info.family_name].filter(Boolean).join(' '),
      },
    };
  }

  @Post('logout')
  async logout(@Body() body: { refreshToken: string }) {
    return this.keycloak.logout(body.refreshToken);
  }
}
