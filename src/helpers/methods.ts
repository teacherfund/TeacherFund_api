// using SendGrid's v3 Node.js Library
// https://github.com/sendgrid/sendgrid-nodejs
const sgMail = require('@sendgrid/mail')
sgMail.setApiKey(process.env.SENDGRID_API_KEY)

export const sendEmail = (key: string) => {
  const emailMagicLink = `https://theteacherfund.com/verify?token=${key}`
  const msg = {
    to: 'test@example.com',
    from: 'test@example.com',
    subject: 'Sending with SendGrid is Fun',
    text: `click <a href="${emailMagicLink}">here</a> to login`,
    html: `<div>click <a href="${emailMagicLink}">here</a> to login</div>`,
  };
  sgMail.send(msg);
}
