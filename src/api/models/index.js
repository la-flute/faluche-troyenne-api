module.exports = function(sequelize) {
  const User = sequelize.import(`${__dirname}/user`)
  const Team = sequelize.import(`${__dirname}/team`)
  const Order = sequelize.import(`${__dirname}/order`)
  const Permission = sequelize.import(`${__dirname}/permission`)
  const Bedroom = sequelize.import(`${__dirname}/bedroom`)
  const Tinder = sequelize.import(`${__dirname}/tinder`)
  const Target = sequelize.import(`${__dirname}/target`)
  const Price = sequelize.import(`${__dirname}/price`)
  const Item = sequelize.import(`${__dirname}/item`)

  Order.belongsTo(User)
  User.hasMany(Order)

  Order.belongsTo(Price)
  Price.hasMany(Order)

  Item.belongsTo(Order)
  Order.hasMany(Item)

  Item.belongsTo(Price)
  Price.hasMany(Item)

  User.belongsTo(Team)
  Team.hasMany(User)

  User.belongsTo(Bedroom)
  Bedroom.hasMany(User)

  User.belongsTo(User, { foreignKey: 'referentId' })
  User.hasMany(User, { foreignKey: 'referentId' })

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
    Target,
    Team,
    Price,
    Item
  }
}
