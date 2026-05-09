import { ArgumentsHost, Catch, ExceptionFilter } from '@nestjs/common';
import { errorHandler } from 'supertokens-node/framework/express';
import { Error as STError } from 'supertokens-node';

@Catch(STError)
export class SuperTokensExceptionFilter implements ExceptionFilter {
  private handler = errorHandler();

  catch(exception: any, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const req = ctx.getRequest();
    const res = ctx.getResponse();
    return this.handler(exception, req, res, (err: any) => {
      throw err;
    });
  }
}
