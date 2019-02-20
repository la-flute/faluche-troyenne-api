module.exports = (sequelize, DataTypes) => {
  return sequelize.define('bedroom', {
    id: { primaryKey: true, type: DataTypes.UUID, defaultValue: DataTypes.UUIDV4 },
    number: { type: DataTypes.INTEGER },
    floor: { type: DataTypes.INTEGER },
    places: { type: DataTypes.INTEGER },
  })
}
