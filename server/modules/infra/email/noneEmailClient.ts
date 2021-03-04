import { EmailClient } from './emailClient';

export class NoneEmailClient extends EmailClient {
  protected client: any;

  constructor() {
    super();
    // console.info('This email client is for dev only');
  }

  public async sendMessage(params): Promise<void> {
    console.debug('Message sent to nowhere!!', { params });
    return;
  }
}
