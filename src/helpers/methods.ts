// using SendGrid's v3 Node.js Library
// https://github.com/sendgrid/sendgrid-nodejs
const sgMail = require('@sendgrid/mail')
sgMail.setApiKey(process.env.SENDGRID_API_KEY)

export const sendEmail = (link: string, subject: string, body: string) => {
  const msg = {
    to: 'test@example.com',
    from: 'test@example.com',
    subject,
    text: body,
    html: `<div>click <a href="${link}">here</a> to login</div>`
  }
  sgMail.send(msg)
}

export const sendRegisterEmail = (key: string) => {
  const emailMagicLink = `https://theteacherfund.com/account/verify?token=${key}`
  const subject = 'You\'re signed up!'
  const body = `click <a href="${emailMagicLink}">here</a> to visit your account`
  sendEmail(key, subject, body)
}

export const sendResetEmail = (key: string) => {
  const emailMagicLink = `https://theteacherfund.com/account/reset?token=${key}`
  const subject = 'Teacher Fund account reset'
  const body = `click <a href="${emailMagicLink}">here</a> to visit your account`
  sendEmail(key, subject, body)
}
