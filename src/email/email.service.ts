import { Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import * as nodemailer from 'nodemailer';
import { appendFileSync, mkdirSync, existsSync } from 'fs';
import { join } from 'path';

export interface SendEmailOptions {
  to: string;
  subject: string;
  html: string;
}

@Injectable()
export class EmailService {
  private readonly logger = new Logger(EmailService.name);
  private readonly transporter: nodemailer.Transporter;
  private readonly isDevelopment: boolean;

  constructor(private readonly configService: ConfigService) {
    this.isDevelopment = this.configService.get<string>('NODE_ENV') === 'development';
    
    if (!this.isDevelopment) {
      this.transporter = nodemailer.createTransport({
        host: this.configService.get<string>('EMAIL_HOST'),
        port: this.configService.get<number>('EMAIL_PORT'),
        secure: this.configService.get<boolean>('EMAIL_SECURE', false),
        auth: {
          user: this.configService.get<string>('EMAIL_USER'),
          pass: this.configService.get<string>('EMAIL_PASSWORD'),
        },
      });
    }
  }

  async sendEmail(options: SendEmailOptions): Promise<boolean> {
    if (this.isDevelopment) {
      return this.logEmailToFile(options);
    }

    try {
      await this.transporter.sendMail({
        from: this.configService.get<string>('EMAIL_FROM', 'no-reply@example.com'),
        to: options.to,
        subject: options.subject,
        html: options.html,
      });
      this.logger.log(`Email sent to ${options.to}`);
      return true;
    } catch (error) {
      this.logger.error(`Failed to send email to ${options.to}`, error);
      return false;
    }
  }

  private logEmailToFile(options: SendEmailOptions): boolean {
    try {
      const logDir = join(process.cwd(), 'logs');
      if (!existsSync(logDir)) {
        mkdirSync(logDir, { recursive: true });
      }

      const logFile = join(logDir, 'email.log');
      const timestamp = new Date().toISOString();
      const logEntry = `
========================================
Timestamp: ${timestamp}
To: ${options.to}
Subject: ${options.subject}
HTML Content:
${options.html}
========================================
`;
      appendFileSync(logFile, logEntry, 'utf-8');
      this.logger.log(`Email logged to file for ${options.to}`);
      return true;
    } catch (error) {
      this.logger.error('Failed to log email to file', error);
      return false;
    }
  }

  async sendConfirmationEmail(email: string, firstName: string, token: string): Promise<boolean> {
    const confirmationUrl = `${this.configService.get<string>('APP_URL', 'http://localhost:3000')}/auth/confirm-email?token=${token}`;
    const subject = 'Confirm your email address';
    const html = `
      <!DOCTYPE html>
      <html>
      <head>
        <style>
          body { font-family: Arial, sans-serif; background-color: #f4f4f4; margin: 0; padding: 20px; }
          .container { max-width: 600px; margin: 0 auto; background-color: #ffffff; border-radius: 8px; overflow: hidden; box-shadow: 0 2px 10px rgba(0,0,0,0.1); }
          .header { background-color: #28a745; color: #ffffff; padding: 20px; text-align: center; }
          .content { padding: 30px; text-align: center; }
          .button { display: inline-block; padding: 12px 24px; background-color: #28a745; color: #ffffff; text-decoration: none; border-radius: 4px; font-weight: bold; margin: 20px 0; }
          .footer { background-color: #f8f9fa; padding: 15px; text-align: center; font-size: 12px; color: #6c757d; }
        </style>
      </head>
      <body>
        <div class="container">
          <div class="header">
            <h1>Welcome, ${firstName}!</h1>
          </div>
          <div class="content">
            <p>Thank you for registering. Please confirm your email address by clicking the button below:</p>
            <a href="${confirmationUrl}" class="button">Confirm Email</a>
            <p>This link is valid for <strong>24 hours</strong>.</p>
            <p>If you didn't register for an account, please ignore this email.</p>
          </div>
          <div class="footer">
            <p>This is an automated message, please do not reply.</p>
          </div>
        </div>
      </body>
      </html>
    `;

    return this.sendEmail({ to: email, subject, html });
  }

  async sendPasswordResetCode(email: string, code: string): Promise<boolean> {
    const subject = 'Password Reset Code';
    const html = `
      <!DOCTYPE html>
      <html>
      <head>
        <style>
          body { font-family: Arial, sans-serif; background-color: #f4f4f4; margin: 0; padding: 20px; }
          .container { max-width: 600px; margin: 0 auto; background-color: #ffffff; border-radius: 8px; overflow: hidden; box-shadow: 0 2px 10px rgba(0,0,0,0.1); }
          .header { background-color: #007bff; color: #ffffff; padding: 20px; text-align: center; }
          .content { padding: 30px; text-align: center; }
          .code { font-size: 36px; font-weight: bold; color: #007bff; letter-spacing: 8px; margin: 20px 0; }
          .footer { background-color: #f8f9fa; padding: 15px; text-align: center; font-size: 12px; color: #6c757d; }
        </style>
      </head>
      <body>
        <div class="container">
          <div class="header">
            <h1>Password Reset</h1>
          </div>
          <div class="content">
            <p>You requested a password reset. Use the code below to reset your password:</p>
            <div class="code">${code}</div>
            <p>This code is valid for <strong>1 hour</strong>.</p>
            <p>If you didn't request this, please ignore this email.</p>
          </div>
          <div class="footer">
            <p>This is an automated message, please do not reply.</p>
          </div>
        </div>
      </body>
      </html>
    `;

    return this.sendEmail({ to: email, subject, html });
  }
}
