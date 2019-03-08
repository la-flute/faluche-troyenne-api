
module.exports = (sequelize, DataTypes) => {
    return sequelize.define('display', {
      id: { primaryKey: true, type: DataTypes.UUID, defaultValue: DataTypes.UUIDV4 },
      name: { type: DataTypes.STRING, defaultValue: null },
      code: { type: DataTypes.STRING, defaultValue: null},
      render: { type: DataTypes.BOOLEAN, defaultValue: false },
    })
  }
  