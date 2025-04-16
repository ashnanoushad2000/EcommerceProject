import { Injectable } from '@nestjs/common';
import * as nodemailer from 'nodemailer';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class MailService {
  private transporter;

  constructor(private readonly configService: ConfigService) {
    this.transporter = nodemailer.createTransport({
      service: 'gmail',
      auth: {
        user: this.configService.get<string>('EMAIL_USER'),
        pass: this.configService.get<string>('EMAIL_PASS'),
      },
    });
  }

  async sendConfirmationEmail(to: string, token: string) {
    // ✅ Redirect to frontend confirmation page
    const confirmationUrl = `http://localhost:4200/confirm-email?token=${token}`;

    await this.transporter.sendMail({
      from: `"ASHCART" <${this.configService.get('EMAIL_USER')}>`,
      to,
      subject: 'Confirm Your Email - ASHCART 🛒',
      html: `
        <h2>Welcome to ASHCART!</h2>
        <p>Thanks for signing up, please confirm your email address:</p>
        <a href="${confirmationUrl}" style="color:blue;">Click to Confirm Email</a>
        <p>If you didn't sign up, you can ignore this email.</p>
      `,
    });
  }

  async sendOrderConfirmationEmail(to: string, orderId: number) {
    const orderUrl = `http://localhost:4200/tracking/${orderId}`;

    await this.transporter.sendMail({
      from: `"ASHCART Orders" <${this.configService.get('EMAIL_USER')}>`,
      to,
      subject: '🛒 Your Order Has Been Placed!',
      html: `
        <h2>🎉 Thanks for your order!</h2>
        <p>Your order ID is <strong>#${orderId}</strong>.</p>
        <p>You can track your order here:</p>
        <a href="${orderUrl}">${orderUrl}</a>
      `,
    });
  }
}
