export default (sequelize: any, DataTypes: any) => {
  const Payment = sequelize.define('Payment', {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true
    },
    amount: {
      type: DataTypes.INTEGER,
      defaultValue: 0
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
  Payment.associate = (db: any) => {
    Payment.hasOne(db.User, { foreignKey: 'user_id' })
    Payment.hasMany(db.Picture, { as: 'pictures' })
  }
  return Payment
}
