
module.exports = (sequelize, DataTypes) => {
  return sequelize.define('permission', {
    id: { primaryKey: true, type: DataTypes.UUID, defaultValue: DataTypes.UUIDV4 },
    admin: { type: DataTypes.BOOLEAN, defaultValue: false },
  })
}
