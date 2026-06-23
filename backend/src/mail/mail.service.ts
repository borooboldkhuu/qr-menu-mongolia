import { Injectable } from '@nestjs/common';
import * as nodemailer from 'nodemailer';

@Injectable()
export class MailService {
  private transporter: nodemailer.Transporter;

  constructor() {
    this.transporter = nodemailer.createTransport({
      host: process.env.SMTP_HOST || 'smtp.gmail.com',
      port: parseInt(process.env.SMTP_PORT || '587'),
      secure: false,
      auth: {
        user: process.env.SMTP_USER,
        pass: process.env.SMTP_PASS,
      },
    });
  }

  async sendPasswordReset(to: string, resetLink: string) {
    await this.transporter.sendMail({
      from: `"QR Menu Mongolia" <${process.env.SMTP_USER}>`,
      to,
      subject: 'Нууц үг сэргээх',
      html: `
        <h2>Нууц үг сэргээх</h2>
        <p>Та нууц үгээ сэргээх хүсэлт гаргасан.</p>
        <p><a href="${resetLink}">Энд дарж нууц үгээ шинэчлэх</a></p>
        <p>Энэ линк 1 цагийн дараа хүчингүй болно.</p>
        <p>Хэрэв та энэ хүсэлтийг гаргаагүй бол энэ имэйлийг үл тооно уу.</p>
      `,
    });
  }

  async sendWelcome(to: string, name: string) {
    await this.transporter.sendMail({
      from: `"QR Menu Mongolia" <${process.env.SMTP_USER}>`,
      to,
      subject: 'QR Menu Mongolia-д тавтай морил',
      html: `
        <h2>Сайн байна уу, ${name}!</h2>
        <p>QR Menu Mongolia-д бүртгүүлсэнд баярлалаа.</p>
        <p>Та 14 хоногийн үнэгүй туршилтын хугацааг эхлүүллээ.</p>
        <p><a href="${process.env.FRONTEND_URL}">Энд дарж админ самбартаа нэвтрэх</a></p>
      `,
    });
  }
}
