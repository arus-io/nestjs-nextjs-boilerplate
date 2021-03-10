import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import moment from 'moment';
import { DeepPartial, Repository } from 'typeorm';
import * as Sentry from '@sentry/node';

import { Medium, Message } from './models/message.entity';
import { EmailClient } from '../infra/email/emailClient';
import { SmsClient } from '../infra/sms/smsClient';
import { NoneEmailClient } from '../infra/email/noneEmailClient';
import { SendgridClient } from '../infra/email/sendgridClient';
import { NoneSmsClient } from '../infra/sms/noneSmsClient';
import { TwilioClient } from '../infra/sms/twilioClient';
import { logger } from '../infra/logger';
import { ConfigService } from '@nestjs/config';
import { hydrateTemplate } from './templates';
import templates from './templates/templates';

interface MessageOptions {
  mail?: string | string[];
  fromMail?: string;
  phone?: string;
  fromPhone?: string;
  medium: 'sms' | 'mail';
  safe?: boolean;
  initiatorId?: number;
  receiverId?: number;
}

@Injectable()
export class MessageService {
  public emailClient: EmailClient;
  public smsClient: SmsClient;
  private readonly emailDomainWhitelist: string[] | undefined;

  constructor(
    @InjectRepository(Message)
    private readonly msgRepo: Repository<Message>,
    private readonly configService: ConfigService,
  ) {
    logger.debug(`Mailer client = ${configService.get('EMAIL_CLIENT')}, Sms client = ${configService.get('SMS_CLIENT')}`);
    this.emailClient = configService.get('EMAIL_CLIENT') === 'none' ?
      new NoneEmailClient()
      : new SendgridClient(configService.get('SENDGRID_API_KEY'));
    this.smsClient = configService.get('SMS_CLIENT') === 'none' ?
      new NoneSmsClient() :
      new TwilioClient(configService.get('TWILIO_ACCOUNT_SID'), configService.get('TWILIO_AUTH_TOKEN'));
    this.emailDomainWhitelist = configService.get('EMAIL_WHITELIST') && configService.get('EMAIL_WHITELIST').split(',');
  }

  async findAll(): Promise<Message[]> {
    // last 100... until we build a better UI
    return this.msgRepo.find({ take: 100, order: { id: 'DESC' }, relations: ['initiator'] });
  }

  async findRecentMessages(userId, daysBack): Promise<Message[]> {
    // last 100... until we build a better UI
    const dateLookBack = moment().subtract(daysBack, 'day');
    return this.msgRepo
      .createQueryBuilder('m')
      .select(['m.code'])
      .where('m.receiverId  = :userId and m.createdAt > :dateLookBack', { userId, dateLookBack })
      .getMany();
  }

  async createMessage(t: DeepPartial<Message>): Promise<Message> {
    return this.msgRepo.save(t);
  }

  async sendMessageTemplate(template, data, opts: MessageOptions) {
    const t = hydrateTemplate(template, data);
    return this.sendMessage(template.code, t, opts);
  }


  /**
   * Main sendMessage function, see if there's not a wrapping function before using it
   */
  async sendMessage(
    code: string,
    content: {
      sms: string;
      subject: string;
      html: string;
      innerBody?: string;
    },
    opts: MessageOptions,
  ) {
    const message: DeepPartial<Message> = {
      code: code || 'asdf',
      receiverId: opts.receiverId,
      initiatorId: opts.initiatorId,
    };
    let error;
    try {
      const sendSms = opts.medium === 'sms';
      if (sendSms) {
        message.body = content.sms;
        message.subject = '';
        message.to = opts.phone;
        message.from = opts.fromPhone || this.configService.get('SMS_FROM');
        message.medium = Medium.SMS;
        await this.sendSms(content, { from: message.from, to: opts.phone });
      } else {
        message.body = content.innerBody || content.html;
        message.subject = content.subject;
        message.to = (opts.mail as any).join ? (opts.mail as any).join(',') : opts.mail;
        message.from = opts.fromMail || this.configService.get('EMAIL_FROM');
        message.medium = Medium.EMAIL;
        await this.sendEmail(content, { from: message.from, to: opts.mail });
      }
    } catch (err) {
      error = err;
      message.error = err.message;
      logger.error(err);
      Sentry.captureException(err);
    }

    let m = await this.createMessage(message);
    if (error && !opts.safe) {
      throw error;
    }
    return m;
  }

  async sendSmsNotificationsEnabled(user) {
    await this.sendMessageTemplate(
      templates.SMS_ENABLED,
      {},
      {
        medium: 'sms',
        phone: user.phone,
        receiverId: user.id,
        initiatorId: user.id,
      },
    );
  }
  async sendSmsTwoFactor(userId, phone, number) {
    await this.sendMessageTemplate(
      templates.TWO_FACTOR_SMS,
      { number },
      {
        medium: 'sms',
        phone,
        receiverId: userId,
        initiatorId: userId,
      },
    );
  }

  async sendForgotPassword(userId, to, resetLink) {
    // @TODO - we might need to remove resetLink (puristic about security)
    return this.sendMessageTemplate(
      templates.FORGOT_PASSWORD,
      { resetLink },
      {
        mail: to,
        medium: 'mail',
        receiverId: userId,
        initiatorId: userId,
      },
    );
  }

  public async sendUserWelcomeEmail(user, resetLink, siteLink, initiatorId) {
    await this.sendMessageToUserPreference(
      user,
      templates.WELCOME_USER,
      { ...user, resetLink, siteLink },
      { initiatorId },
    );
  }


  private async sendMessageToUserPreference(user: any, template, data, opts: { safe?: boolean; initiatorId?: number }) {
    if (user.toJSON) {
      throw new Error('user needs to be a plain object. send user.safe()');
    }

    const sendSms = template.sms && user.prefersPhone && user.phone;
    return this.sendMessageTemplate(template, data, {
      mail: user.email,
      phone: user.phone,
      medium: sendSms ? 'sms' : 'mail',
      safe: opts?.safe,
      receiverId: user.id,
      initiatorId: opts.initiatorId,
    });
  }

  private checkEmailWhitelist(to: string | string[]): boolean {
    if (Array.isArray(to)) {
      return to.every((r) => this.checkEmailWhitelist(r));
    } else {
      return !this.emailDomainWhitelist || this.emailDomainWhitelist.some((d) => to.includes(d));
    }
  }

  private async sendEmail({ html, subject }, opts: { from?: string; to: string | string[] }) {
    const message = {
      to: opts.to,
      from: opts.from,
      html: html,
      subject: subject,
      trackingSettings: {
        subscriptionTracking: { enable: false },
      },
      mailSettings: {
        bypassListManagement: { enable: true }, // @send even if unsubscribed
      },
    };
    if (!this.checkEmailWhitelist(opts.to)) {
      logger.info(`Skip message to ${opts.to} due whitelist restriction`, message);
      return;
    } else {
      await this.emailClient.sendMessage(message);
    }
  }

  private sendSms({ sms }, opts: { from: string; to: string }) {
    return this.smsClient.sendMessage({
      body: sms,
      from: opts.from,
      to: opts.to,
    });
  }
}
