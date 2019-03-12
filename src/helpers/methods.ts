const AWS = require('aws-sdk')
const ses = new AWS.SES()

export const getEmailParams = async (email: string, link: string, subject: string, body: string) => {
  const htmlBody = body || `<div>click <a href="${link}">here</a> to login</div>`
  const emailParams = {
    Destination: {
      ToAddresses: [email]
    },
    Message: {
      Body: {
        Html: {
          Charset: 'UTF-8',
          Data: htmlBody
        }
      },
      Subject: {
        Charset: 'UTF-8',
        Data: subject
      }
    },
    Source: 'Joel from TeacherFund <joelwass@theteacherfund.com>'
  }
  return ses.sendEmail(emailParams).promise()
}

export const sendMagicLinkEmail = (email: string, key: string): Promise<void> => {
  const emailMagicLink = `https://theteacherfund.com/account/verify?token=${key}`
  const subject = 'You\'re signed up!'
  const body = `click <a href="${emailMagicLink}">here</a> to visit your account`
  return getEmailParams(email, key, subject, body)
}
