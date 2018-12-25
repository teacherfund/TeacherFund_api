import { Frequency } from '../@types/donations'
const bcrypt = require('bcrypt')
const helper = require('../helper')

module.exports = (sequelize: any, DataTypes: any) => {
  const Donation = sequelize.define('Donation', {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true
    },
    ammount: {
      type: DataTypes.INTEGER,
      defaultValue: 0
    },
    frequency: {
      type: DataTypes.STRING,
      defaultValue: Frequency.Monthly
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
    freezeTableName: true
  })
  Donation.associate = (db: Database) => {
    Donation.hasOne(db.getModel('User'), { foreignKey: 'user_id' })
  }
  return Donation
}
