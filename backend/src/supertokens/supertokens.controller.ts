import { Controller, Get, Post, Req, UseGuards } from '@nestjs/common';
import { Request } from 'express';
import supertokens from 'supertokens-node';
import Session from 'supertokens-node/recipe/session';
import { SuperTokensAuthGuard } from './supertokens.guard';

@Controller('api/supertokens')
export class SuperTokensController {
  @Get('profile')
  @UseGuards(SuperTokensAuthGuard)
  async profile(@Req() req: Request & { session?: any }) {
    const userId = req.session.getUserId();
    const user = await supertokens.getUser(userId);
    return {
      provider: 'supertokens',
      user: {
        id: userId,
        email: user?.emails?.[0],
      },
      session: {
        handle: req.session.getHandle(),
        expiry: req.session.getExpiry(),
        timeCreated: req.session.getTimeCreated(),
      },
    };
  }

  @Get('sessions')
  @UseGuards(SuperTokensAuthGuard)
  async listSessions(@Req() req: Request & { session?: any }) {
    const userId = req.session.getUserId();
    const handles = await Session.getAllSessionHandlesForUser(userId);
    const current = req.session.getHandle();
    const details = await Promise.all(
      handles.map(async (handle: string) => {
        const info = await Session.getSessionInformation(handle);
        return {
          handle,
          isCurrent: handle === current,
          timeCreated: info?.timeCreated,
          expiry: info?.expiry,
        };
      }),
    );
    return { count: details.length, sessions: details };
  }

  @Post('sign-out-others')
  @UseGuards(SuperTokensAuthGuard)
  async signOutOthers(@Req() req: Request & { session?: any }) {
    const userId = req.session.getUserId();
    const handles = await Session.getAllSessionHandlesForUser(userId);
    const current = req.session.getHandle();
    const toRevoke = handles.filter((h: string) => h !== current);
    if (toRevoke.length) await Session.revokeMultipleSessions(toRevoke);
    return { revoked: toRevoke.length };
  }
}
