module.exports = (sequelize: any, DataTypes: any) => {
  const Payout = sequelize.define('Payout', {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true
    },
    ammount: {
      type: DataTypes.INTEGER,
      defaultValue: 0
    },
    description: {
      type: DataTypes.STRING
    },
    locations: {
      type: DataTypes.STRING
    },
    pictures: {
      type: DataTypes.JSON
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
  Payout.associate = (db: Database) => {
    // link to teacher account and school
    Payout.hasOne(db.getModel('Account'), { foreignKey: 'account_id' })
    Payout.hasOne(db.getModel('School'), { foreignKey: 'school_id' })
  }
  return Payout
}
