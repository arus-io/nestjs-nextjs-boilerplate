import { Injectable, LoggerService } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import safeStringify from 'fast-safe-stringify';
import { createLogger, format, LogEntry, Logger, transports } from 'winston';

import { TConfiguration } from '../config/config';
const colors = require('colors/safe');

const colorScheme: Record<string, any> = {
  info: colors.brightGreen,
  error: colors.red,
  warn: colors.yellow,
  debug: colors.brightMagenta,
  verbose: colors.brightCyan,
};
@Injectable() // { scope: Scope.TRANSIENT } having issues to inject in middlewares
export class AppLogger implements LoggerService {
  private context?: string;
  private readonly logger: Logger;

  constructor(configService: ConfigService<TConfiguration>) {
    this.logger = createLogger({
      level: configService.get('LOG_LEVEL', 'info'),
      format: format.json(),
      // defaultMeta: { service: 'user-service' },
      transports: [
        new transports.Console({
          format: format.combine(
            // format.colorize(),
            format.errors({ stack: true }),
            // label({ label: 'right meow!' }),
            format.timestamp(),
            // format.prettyPrint(),
            this.nestLikeConsoleFormat('backend'),
            // format.simple(),
          ),
        }),
        // new transports.File({ filename: 'error.log', level: 'error' }),
        // new transports.File({ filename: 'combined.log' }),
      ],
    });
  }

  // public setContext(context: string) {
  //   this.context = context;
  // }

  // to debug - measure time
  public profile(name: string, meta?: LogEntry) {
    this.logger.profile(name, meta);
  }

  public log(message: any, context?: string): any {
    this.doLog('info', message, context);
  }

  public error(message: any, trace?: string, context?: string): any {
    if (message instanceof Error) {
      message.stack = trace || message.stack; //use whatever we get here
      return this.doLog('error', message, context);
    }

    if ('object' === typeof message) {
      message.stack = message.stack || trace;
      return this.doLog('error', message, context);
    }
    // Nest handlers will send it this way.. .message and trace separated
    return this.doLog('error', { message: trace }, context);
  }

  public warn(message: any, context?: string): any {
    this.doLog('warn', message, context);
  }

  public debug?(message: any, context?: string): any {
    this.doLog('debug', message, context);
  }

  public verbose?(message: any, context?: string): any {
    this.doLog('verbose', message, context);
  }

  private doLog(level: string, message: any, context?: any): any {
    context = context || this.context;

    if (message instanceof Error) {
      // send stack as message, as it's usually not jsonified and it prints well in console.
      // we'll need to adapt it if we need to send logs to another transport
      const { message: _message, name, stack, ...meta } = message;

      return this.logger.log(level, _message + stack, { context, name, ...meta }); //stack,
    }

    if ('object' === typeof message) {
      const { message: _message, ...meta } = message;

      return this.logger.log(level, (_message ?? level) as string, { context, ...meta });
    }

    return this.logger.log(level, message ?? level, { context });
  }

  private nestLikeConsoleFormat = (appName = 'NestWinston') =>
    format.printf((m) => {
      const { context, level, timestamp, message, ...meta } = m;

      const color = colorScheme[level] || ((text: string): string => text);
      let metaStr = safeStringify(meta, null, 2); // pretty print (for console only)
      if (metaStr === '{}') {
        metaStr = '';
      }
      return (
        `${colors.brightMagenta(`[${appName}]`)} ` +
        `${color(level)} ` +
        (timestamp !== undefined ? `${new Date(timestamp).toISOString()} ` : '') +
        (context !== undefined ? `${'[' + context + ']'} ` : '') +
        `${message} ` +
        `${metaStr}`
      );
    });
}
