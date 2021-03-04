import { MailService } from '@sendgrid/mail';
import { MailDataRequired } from '@sendgrid/mail/src/mail';

import { EmailClient } from './emailClient';

export class SendgridClient extends EmailClient {
  private client: MailService;

  constructor(apiKey: string ) {
    super();
    this.client = new MailService();
    this.client.setApiKey(apiKey);
  }

  public async sendMessage(msg: MailDataRequired) {
    try {
      const response = await this.client.send({
        ...msg,
      });
      console.info('email response is', msg.to, response[0].statusCode);
    } catch (e) {
      const errors = e?.response?.body?.errors;
      console.error('Error to send email', msg.to, errors || e);
      throw new Error((errors && errors[0]?.message) || 'Unknown error');
    }
  }
}
