const AWS = require('aws-sdk')
const path = require('path')
AWS.config.loadFromPath(path.join(__dirname, '../../awscredentials.json'))
if (!AWS.config.region) {
  AWS.config.update({
    region: 'us-east-1'
  })
}
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
  const emailMagicLink = `https://theteacherfund.com?auth=${key}&email=${email}`
  const subject = 'You\'re in!'
  const body = `click <a href="${emailMagicLink}">here</a> to visit your account`
  return getEmailParams(email, key, subject, body)
}
