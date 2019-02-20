module.exports = (sequelize, DataTypes) => {
  return sequelize.define('user', {
    id: { primaryKey: true, type: DataTypes.UUID, defaultValue: DataTypes.UUIDV4 },
    name: { type: DataTypes.STRING, unique: true },
    lastName: { type: DataTypes.STRING },
    firstName: { type: DataTypes.STRING },
    email: { type: DataTypes.STRING, validate: { isEmail: true }, unique: true },
    gender: { type: DataTypes.STRING, defaultValue: 'N/A' },
    caution: { type: DataTypes.BOOLEAN, defaultValue: false },
    attestation: { type: DataTypes.BOOLEAN, defaultValue: false },
    password: { type: DataTypes.STRING },
    registerToken: { type: DataTypes.STRING },
    resetToken: { type: DataTypes.STRING },
  })
}
