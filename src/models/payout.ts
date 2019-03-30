export default (sequelize: any, DataTypes: any) => {
  const Payout = sequelize.define('Payout', {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true
    },
    amount: {
      type: DataTypes.INTEGER,
      defaultValue: 0
    },
    description: {
      type: DataTypes.STRING
    },
    pictures: {
      type: DataTypes.BLOB
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
  Payout.associate = (db: any) => {
    // link to teacher account and school
    Payout.hasOne(db.Account, { foreignKey: 'account_id' })
    Payout.hasOne(db.School, { foreignKey: 'school_id' })
  }
  return Payout
}
