module.exports = function(sequelize) {
  const User = sequelize.import(`${__dirname}/user`)
  const Order = sequelize.import(`${__dirname}/order`)
  const Permission = sequelize.import(`${__dirname}/permission`)
  const Bedroom = sequelize.import(`${__dirname}/bedroom`)
  const Tinder = sequelize.import(`${__dirname}/tinder`)
  const Target = sequelize.import(`${__dirname}/target`)

  Order.belongsTo(User)
  User.hasMany(Order)

  User.belongsTo(Bedroom)
  Bedroom.hasMany(User)

  Permission.belongsTo(User)
  User.hasOne(Permission)

  User.belongsToMany(User, { through: Tinder, as: 'liked' })
  User.belongsToMany(User, { through: Target, as: 'targeted' })


  return {
    User,
    Order,
    Permission,
    Bedroom,
    Tinder,
    Target
  }
}
