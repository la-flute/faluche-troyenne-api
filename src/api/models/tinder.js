
module.exports = (sequelize, DataTypes) => {
  return sequelize.define('tinder', {
    id: { primaryKey: true, type: DataTypes.UUID, defaultValue: DataTypes.UUIDV4 },
  })
}
