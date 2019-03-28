module.exports = (sequelize, DataTypes) => {
  return sequelize.define('user', {
    id: {
      primaryKey: true,
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4
    },
    nickName: { type: DataTypes.STRING },
    lastName: { type: DataTypes.STRING },
    firstName: { type: DataTypes.STRING },
    email: {
      type: DataTypes.STRING,
      validate: { isEmail: true },
      unique: true
    },
    town: { type: DataTypes.STRING },
    studies: { type: DataTypes.STRING },
    phone: { type: DataTypes.STRING },
    address: { type: DataTypes.STRING },
    referent_lastName: { type: DataTypes.STRING },
    referent_firstName: { type: DataTypes.STRING },
    referent_phone: { type: DataTypes.STRING },
    isMajeur: { type: DataTypes.BOOLEAN },
    regime: { type: DataTypes.STRING },
    allergies: { type: DataTypes.STRING },
    medication: { type: DataTypes.STRING },
    image: { type: DataTypes.STRING },
    catchphrase: { type: DataTypes.STRING },
    folklore: { type: DataTypes.STRING },
    trajet: { type: DataTypes.STRING },
    trajet_commentaire: { type: DataTypes.STRING },
    caution: { type: DataTypes.BOOLEAN, defaultValue: false },
    attestation: { type: DataTypes.BOOLEAN, defaultValue: false },
    password: { type: DataTypes.STRING },
    registerToken: { type: DataTypes.STRING },
    resetToken: { type: DataTypes.STRING },
    validated: { type: DataTypes.BOOLEAN, defaultValue: false },
    maxTurboLikes: { type: DataTypes.INTEGER, defaultValut: 3 }
  })
}
