// export interface MessageParameters {
//   messageId: string;
//   data: any;
// }
import { MailDataRequired } from '@sendgrid/mail/src/mail'; // @TODO extract common func if we add more clients

export abstract class EmailClient {
  public abstract async sendMessage(params: MailDataRequired): Promise<void>;
}
