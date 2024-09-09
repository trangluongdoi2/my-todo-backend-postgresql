import config from '@/config';
import nodemailer from 'nodemailer';

class MailService {
  transporter;
  constructor() {
    this.transporter = nodemailer.createTransport({
      service: 'Gmail',
      auth: {
        user: config.email_tranposter.email,
        pass: config.email_tranposter.pass,
      }
    });
  }
  sendMail(fromEmail: string, destEmail: string) {
    const createHtml = `
      <div>
        <h1>Invite you to join <strong>${1}</strong></h1>
        <button>Accept</button>
      </div>
    `;
    const mainOptions = {
      from: fromEmail,
      to: destEmail,
      subject: 'nonereplay',
      text: `You recieved message from ${fromEmail}`,
      html: createHtml,
    };
    try {
      this.transporter.sendMail(mainOptions, (err, info) => {
        if (err) {
          console.log(err);
          return false;
        } else {
          console.log('Message sent: ' +  info.response);
          return true;
        }
      });
    } catch (error) {
      console.log(error, 'error...');
    }
  }
}

export default new MailService();