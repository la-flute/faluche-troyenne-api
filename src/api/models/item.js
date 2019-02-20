
module.exports = (sequelize, DataTypes) => {
  return sequelize.define('item', {
    id: { primaryKey: true, type: DataTypes.UUID, defaultValue: DataTypes.UUIDV4 },
    name: { type: DataTypes.STRING, defaultValue: null },
    prix: { type: DataTypes.INTEGER, defaultValue: 0 },
  })
}
