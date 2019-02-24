
module.exports = (sequelize, DataTypes) => {
  return sequelize.define('order', {
    id: { primaryKey: true, type: DataTypes.UUID, defaultValue: DataTypes.UUIDV4 },
    paid: { type: DataTypes.BOOLEAN, defaultValue: false },
    paid_at: { type: DataTypes.STRING, defaultValue: null },
    alcool: { type: DataTypes.BOOLEAN, defaultValue: false },
    bedroom: { type: DataTypes.BOOLEAN, defaultValue: false },
    transactionId: { type: DataTypes.INTEGER, defaultValue: 0 },
    transactionState: { type: DataTypes.STRING, defaultValue: null },
  })
}
