import { logger } from '../logger';
import { SmsClient } from './smsClient';

export class NoneSmsClient extends SmsClient {
  protected client: any;

  constructor() {
    super();
  }

  public async sendMessage(params): Promise<void> {
    logger.debug('Sms sent to nowhere!!', { params });
    return;
  }
}
