import { CanActivate, ExecutionContext, Injectable, UnauthorizedException } from '@nestjs/common';
import { getSession } from 'supertokens-node/recipe/session';

@Injectable()
export class SuperTokensAuthGuard implements CanActivate {
  async canActivate(context: ExecutionContext): Promise<boolean> {
    const req = context.switchToHttp().getRequest();
    const res = context.switchToHttp().getResponse();
    try {
      const session = await getSession(req, res, { sessionRequired: true });
      req.session = session;
      return true;
    } catch (err) {
      throw new UnauthorizedException('No active SuperTokens session');
    }
  }
}
