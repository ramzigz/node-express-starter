import nodemailer from 'nodemailer';
import configLog4js from '../config/configLog4js.js';

// async..await is not allowed in global scope, must use a wrapper
const sendMail = (settings) => {
  async function main() {
    try {
      // Generate test SMTP service account from ethereal.email
      // Only needed if you don't have a real mail account for testing
      // create reusable transporter object using the default SMTP transport
      const emailUser = {
        user: process.env.EMAIL,
        pass: process.env.EMAIL_PASSWORD,
      };

      const transporter = nodemailer.createTransport({
        host: 'pro2.mail.ovh.net',
        port: 587,
        secure: false,
        auth: emailUser,
        tls: { rejectUnauthorized: false },

      });

      // send mail with defined transport object
      const info = await transporter.sendMail({
        from: process.env.EMAIL || settings.mailOptions.from, // sender address
        to: settings.mailOptions.to, // list of receivers
        cc: settings.mailOptions.cc,
        subject: settings.mailOptions.subject, // Subject line
        text: settings.mailOptions.text || '', // plain text body
        html: settings.mailOptions.html || '', // html body
      });

      configLog4js.loggerinfo.info('Message sent: %s to %s', info, settings.mailOptions.to);

      // Message sent: <b658f8ca-6296-ccf4-8306-87d57a0b4321@example.com>
    } catch (error) {
      console.log('error sending email', error);
    }
  }
  main();
};

export default sendMail;
