import { All, Controller, Req, Res } from '@nestjs/common';
import { Request, Response } from 'express';
import { auth } from './better-auth.instance';

function toWebRequest(req: Request): globalThis.Request {
  const url = `${req.protocol}://${req.get('host')}${req.originalUrl}`;
  const headers = new Headers();
  for (const [k, v] of Object.entries(req.headers)) {
    if (Array.isArray(v)) headers.set(k, v.join(', '));
    else if (typeof v === 'string') headers.set(k, v);
  }
  const method = req.method.toUpperCase();
  const init: RequestInit = { method, headers };
  if (method !== 'GET' && method !== 'HEAD') {
    init.body = req.body && Object.keys(req.body).length ? JSON.stringify(req.body) : undefined;
    if (init.body && !headers.has('content-type')) {
      headers.set('content-type', 'application/json');
    }
  }
  return new Request(url, init);
}

async function sendWebResponse(webRes: globalThis.Response, res: Response) {
  res.status(webRes.status);
  webRes.headers.forEach((value, key) => {
    if (key.toLowerCase() === 'set-cookie') {
      res.append('set-cookie', value);
    } else {
      res.setHeader(key, value);
    }
  });
  const buf = Buffer.from(await webRes.arrayBuffer());
  res.send(buf);
}

@Controller('api/better-auth')
export class BetterAuthController {
  @All('*')
  async handle(@Req() req: Request, @Res() res: Response) {
    const webReq = toWebRequest(req);
    const webRes = await auth.handler(webReq);
    return sendWebResponse(webRes, res);
  }
}
