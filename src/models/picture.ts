module.exports = (sequelize: any, DataTypes: any) => {
  const Picture = sequelize.define('Picture', {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true
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
  Picture.associate = (db: Database) => {
    // link to payout
    Picture.hasOne(db.getModel('Payout'), { foreignKey: 'payout_id' })
  }
  return Picture
}
