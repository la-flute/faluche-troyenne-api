module.exports = (sequelize, DataTypes) => {
  return sequelize.define('price', {
    id: { primaryKey: true, type: DataTypes.UUID, defaultValue: DataTypes.UUIDV4 },
    name: { type: DataTypes.STRING },
    start: { type: DataTypes.DATE },
    end: { type: DataTypes.DATE },
    value: { type: DataTypes.DOUBLE, defaultValue: 0 },
  })
}
