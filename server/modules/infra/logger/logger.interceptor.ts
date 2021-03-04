import { CallHandler, ExecutionContext, Injectable, NestInterceptor } from '@nestjs/common';
import { GqlExecutionContext } from '@nestjs/graphql';
import { Observable, throwError } from 'rxjs';
import { catchError, tap } from 'rxjs/operators';

import { AppLogger } from './app.logger';

@Injectable()
export class LoggerInterceptor implements NestInterceptor {
  constructor(private logger: AppLogger) {}
  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    const loggerContext = 'LoggerInterceptor';
    let req = context.switchToHttp().getRequest();
    if (!req) {
      // @TODO - we have all gql info in GqlExecutionContext.create(context)
      req = GqlExecutionContext.create(context).getContext().req;
    }
    const hrstart = process.hrtime();
    return next.handle().pipe(
      tap((response) => {
        const hrend = process.hrtime(hrstart);
        const executionTime = `${hrend[0]}s  ${hrend[1] / 1000000}ms`;
        const res = context.switchToHttp().getResponse();
        this.logger.log({ message: `${req.method} ${req.originalUrl} (${executionTime})` }, loggerContext);

        this.logger.debug(
          {
            message: `${req.method} ${req.originalUrl} Request and Response`,
            headers: { host: req.headers.host },
            requestBody: req.body,
            responseStatus: res.statusCode,
            responseBody: response,
          },
          loggerContext,
        );
      }),
      catchError((err) => {
        const res = context.switchToHttp().getResponse();
        // console.log(err, req);
        this.logger.warn(
          {
            message: `${req.method} ${req.originalUrl} Failed`,
            headers: { host: req.headers.host },
            requestBody: req.body,
            response: res.body,
            error: err,
          },
          loggerContext,
        );
        return throwError(err);
      }),
    );
  }
}
