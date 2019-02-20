
module.exports = (sequelize, DataTypes) => {
  return sequelize.define('target', {
    id: { primaryKey: true, type: DataTypes.UUID, defaultValue: DataTypes.UUIDV4 },
  })
}
