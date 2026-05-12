import { Injectable, UnauthorizedException } from '@nestjs/common';

interface KeycloakTokenResponse {
  access_token: string;
  refresh_token: string;
  expires_in: number;
  refresh_expires_in: number;
  token_type: string;
  scope: string;
}

interface KeycloakUserInfo {
  sub: string;
  email_verified?: boolean;
  preferred_username?: string;
  email?: string;
  given_name?: string;
  family_name?: string;
}

@Injectable()
export class KeycloakService {
  private get baseUrl() {
    return process.env.KEYCLOAK_BASE_URL || 'http://localhost:8080';
  }
  private get realm() {
    return process.env.KEYCLOAK_REALM || 'noah-demo';
  }
  private get clientId() {
    return process.env.KEYCLOAK_CLIENT_ID || 'noah-demo-client';
  }
  private get realmUrl() {
    return `${this.baseUrl}/realms/${this.realm}`;
  }

  accountConsoleUrl() {
    return `${this.realmUrl}/account/`;
  }

  async login(username: string, password: string): Promise<KeycloakTokenResponse> {
    const body = new URLSearchParams({
      grant_type: 'password',
      client_id: this.clientId,
      username,
      password,
      scope: 'openid profile email',
    });

    const res = await fetch(`${this.realmUrl}/protocol/openid-connect/token`, {
      method: 'POST',
      headers: { 'content-type': 'application/x-www-form-urlencoded' },
      body,
    });

    if (!res.ok) {
      const text = await res.text();
      throw new UnauthorizedException(`Keycloak login failed: ${text}`);
    }
    return (await res.json()) as KeycloakTokenResponse;
  }

  async register(email: string, password: string, firstName?: string, lastName?: string) {
    const adminToken = await this.getAdminToken();
    const res = await fetch(`${this.baseUrl}/admin/realms/${this.realm}/users`, {
      method: 'POST',
      headers: {
        authorization: `Bearer ${adminToken}`,
        'content-type': 'application/json',
      },
      body: JSON.stringify({
        username: email,
        email,
        firstName: firstName || 'Demo',
        lastName: lastName || 'User',
        enabled: true,
        emailVerified: true,
        credentials: [{ type: 'password', value: password, temporary: false }],
      }),
    });

    if (res.status === 409) {
      throw new UnauthorizedException('User already exists');
    }
    if (!res.ok) {
      const text = await res.text();
      throw new UnauthorizedException(`Keycloak signup failed: ${text}`);
    }
    return { ok: true };
  }

  async userInfo(accessToken: string): Promise<KeycloakUserInfo> {
    const res = await fetch(`${this.realmUrl}/protocol/openid-connect/userinfo`, {
      headers: { authorization: `Bearer ${accessToken}` },
    });
    if (!res.ok) throw new UnauthorizedException('Invalid Keycloak token');
    return (await res.json()) as KeycloakUserInfo;
  }

  async logout(refreshToken: string) {
    const body = new URLSearchParams({
      client_id: this.clientId,
      refresh_token: refreshToken,
    });
    await fetch(`${this.realmUrl}/protocol/openid-connect/logout`, {
      method: 'POST',
      headers: { 'content-type': 'application/x-www-form-urlencoded' },
      body,
    });
    return { ok: true };
  }

  private async getAdminToken(): Promise<string> {
    const body = new URLSearchParams({
      grant_type: 'password',
      client_id: 'admin-cli',
      username: 'admin',
      password: 'admin',
    });
    const res = await fetch(
      `${this.baseUrl}/realms/master/protocol/openid-connect/token`,
      { method: 'POST', headers: { 'content-type': 'application/x-www-form-urlencoded' }, body },
    );
    if (!res.ok) {
      throw new UnauthorizedException('Could not acquire Keycloak admin token');
    }
    const data = (await res.json()) as KeycloakTokenResponse;
    return data.access_token;
  }
}
