import { Controller, Get, Req, UseGuards } from '@nestjs/common';
import { Request } from 'express';
import { getUserById } from 'supertokens-node';
import { SuperTokensAuthGuard } from './supertokens.guard';

@Controller('api/supertokens')
export class SuperTokensController {
  @Get('profile')
  @UseGuards(SuperTokensAuthGuard)
  async profile(@Req() req: Request & { session?: any }) {
    const userId = req.session.getUserId();
    const user = await getUserById(userId);
    return {
      provider: 'supertokens',
      user: {
        id: userId,
        email: user?.email,
      },
    };
  }
}
