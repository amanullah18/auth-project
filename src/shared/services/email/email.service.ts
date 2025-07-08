import { Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import * as nodemailer from 'nodemailer';

@Injectable()
export class EmailService {
  private readonly logger = new Logger(EmailService.name);
  private transporter: nodemailer.Transporter;
  private from: string;

  constructor(private configService: ConfigService) {
    console.log('SMTP Configuration:', {
    host: this.configService.get('SMTP_HOST'),
    port: this.configService.get('SMTP_PORT'),
    user: this.configService.get('SMTP_USER'),
    pass: this.configService.get('SMTP_PASS')?.slice(0, 3) + '...', // Mask password
  });
    this.transporter = nodemailer.createTransport({
      host: this.configService.get<string>('SMTP_HOST'),
      port: this.configService.get<number>('SMTP_PORT'),
      secure: false,
      auth: {
        user: this.configService.get<string>('SMTP_USER'),
        pass: this.configService.get<string>('SMTP_PASS'),
      },
    });
    this.from = this.configService.get<string>('SMTP_FROM') || '';
  }

  async sendBookingConfirmation(to: string, name: string, meetLink: string, slot: any) {
    const mailOptions = {
      from: this.from,
      to,
      subject: 'Your Call Booking Confirmation',
      html: `
        <p>Hi ${name},</p>
        <p>Your call has been booked successfully!</p>
        <p><b>Date:</b> ${slot.date}</p>
        <p><b>Time:</b> ${slot.startTime} - ${slot.endTime}</p>
        <p><b>Google Meet Link:</b> <a href="${meetLink}">${meetLink}</a></p>
        <p>Thank you!</p>
      `,
    };

    try {
      await this.transporter.sendMail(mailOptions);
      this.logger.log(`Booking confirmation sent to ${to}`);
      return { 
      success: true, 
      message: `Email sent to ${to} successfully` 
    };
    } catch (error) {
      this.logger.error(`Failed to send email to ${to}`, error);
      return { 
      success: false, 
      message: `Failed to send email: ${error.message}` 
    };
    }
    
  }
} 