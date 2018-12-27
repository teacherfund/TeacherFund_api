import { UserAccount } from '../@types/account'
const bcrypt = require('bcrypt')
const helper = require('../helper')

module.exports = (sequelize: any, DataTypes: any) => {
  const Account = sequelize.define('Account', {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true
    },
    email: {
      type: DataTypes.STRING,
      required: true,
      unique: true
    },
    password: {
      type: DataTypes.STRING,
      required: true
    },
    firstName: {
      type: DataTypes.STRING,
      required: true
    },
    lastName: {
      type: DataTypes.STRING,
      required: true
    },
    role: {
      type: DataTypes.STRING
    },
    createdAt: {
      type: DataTypes.DATE,
      defaultValue: DataTypes.NOW
    },
    updatedAt: {
      type: DataTypes.DATE,
      defaultValue: DataTypes.NOW
    },
    meta: {
      type: DataTypes.JSON
    }
  }, {
    freezeTableName: true,
    hooks: {
      beforeCreate: (account: UserAccount) => {
        return bcrypt.hash(account.password, 10)
          .then((encryptedPassword: string) => {
            account.password = encryptedPassword
          })
          .catch((err: any) => {
            return Promise.reject(err)
          })
      },
      beforeUpdate: (account: any) => {
        if (!account.changed('password')) {
          return
        }

        return bcrypt.hash(account.password, 10)
          .then((encryptedPassword: string) => {
            account.password = encryptedPassword
          })
          .catch((err: any) => {
            return Promise.reject(err)
          })
      }
    }
  })

  Account.authenticate = (body: any) => {
    let account: any
    return Account.findOne({ where: { email: body.email } })
      .then((localAccount: UserAccount) => {
        if (!localAccount) return Promise.reject(new helper.CustomError(helper.strings.sorryWeCantFindEmail))
        account = localAccount
        return bcrypt.compare(body.password, account.password)
      })
      .then((result: any) => {
        if (!result) return Promise.reject(new helper.CustomError(helper.strings.passwordInvalid))
        return Promise.resolve(account)
      })
      .catch((err: any) => {
        return Promise.reject(err)
      })
  }

  return Account
}
