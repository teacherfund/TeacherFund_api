import { Frequency } from '../@types/frequency'
const bcrypt = require('bcrypt')
const helper = require('../helper')

module.exports = (sequelize: any, DataTypes: any) => {
  const Donation = sequelize.define('Donation', {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true
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
  return Donation
}
