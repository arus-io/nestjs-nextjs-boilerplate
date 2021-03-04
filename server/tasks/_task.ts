import { INestApplicationContext } from '@nestjs/common';

export class AppTask {
  constructor(protected app: INestApplicationContext, protected loggerContext) {}

  public async doWork(args?: string[]): Promise<any> {
    throw new Error('override me');
  }
}
