import { Injectable } from '@nestjs/common';
import * as nodemailer from 'nodemailer';

@Injectable()
export class EmailService {
  private transport: nodemailer.Transporter;

  constructor() {
    this.transport = nodemailer.createTransport({
      host: process.env.EMAIL_HOST,
      port: parseInt(process.env.EMAIL_PORT, 10),
      secure: false, // Use SSL ou TLS (para ambientes de producao, certifiqui-se de usar 'true' se o SMTP suportar SSL)
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS,
      },
    });
  }

  async send(to: string, subject: string, content: string) {
    const mailOptions: nodemailer.SendMailOptions = {
      from: `Nao responsa <${process.env.EMAIL_FROM}>`, //Remetente
      to, // Destinatario
      subject, //Assunto
      text: content, // Conteudo do email em texto simples
      // Se precisar enviar em HTML, pode adicionar a propriedade "html"
      // html: '<b> Conteudo HTML </b>',
    };

    await this.transport.sendMail(mailOptions);
  };
}

// npm i nodemailer

// Looking to send emails in production? Check out our Email API/SMTP product!
