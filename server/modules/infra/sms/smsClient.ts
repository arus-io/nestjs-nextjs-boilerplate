export interface SmsParameters {
  body: string;
  from: string;
  to: string;
}

export abstract class SmsClient {
  public abstract sendMessage(params: SmsParameters): Promise<void>;
}
