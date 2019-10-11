import { Frequency } from '../@types/donation'

export default (sequelize: any, DataTypes: any) => {
  const Donation = sequelize.define('Donation', {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true
    },
    amount: {
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
      type: DataTypes.BLOB
    }
  }, {
    freezeTableName: true
  })
  return Donation
}
