import * as Mail from 'nodemailer/lib/mailer';
import { createTransport } from 'nodemailer';
import { Inject, Injectable } from '@nestjs/common';

import { EMAIL_CONFIG_OPTIONS } from './email.module-definition';
import { EmailOptions } from './types/email-options.interface';

@Injectable()
export class EmailService {
  private nodemailerTransport: Mail;

  constructor(@Inject(EMAIL_CONFIG_OPTIONS) private options: EmailOptions) {
    this.nodemailerTransport = createTransport({
      service: options.service,
      auth: {
        user: options.user,
        pass: options.password,
      },
    });
  }

  sendMail(options: Mail.Options) {
    return this.nodemailerTransport.sendMail(options);
  }
}
