import { Twilio } from 'twilio';

import { SmsClient, SmsParameters } from './smsClient';

export class TwilioClient extends SmsClient {
  private client: Twilio;

  constructor(accountSid: string, authToken: string) {
    super();
    this.client = new Twilio(accountSid, authToken);
  }

  public async sendMessage(msg: SmsParameters) {
    try {
      const response = await this.client.messages.create({
        ...msg,
      });
      console.debug('sms response is', response.to, response.status);
    } catch (e) {
      console.error(e);
      throw e;
    }
  }
}
