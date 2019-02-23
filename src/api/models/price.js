module.exports = (sequelize, DataTypes) => {
  return sequelize.define('price', {
    id: { primaryKey: true, type: DataTypes.UUID, defaultValue: DataTypes.UUIDV4 },
    name: { type: DataTypes.STRING },
    alcool: { type: DataTypes.BOOLEAN, defaultValue: false },
    bedroom: { type: DataTypes.BOOLEAN, defaultValue: false },
    start: { type: DataTypes.DATE },
    end: { type: DataTypes.DATE },
    value: { type: DataTypes.INTEGER, defaultValue: 0 },
  })
}
