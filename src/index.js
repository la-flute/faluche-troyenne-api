const http = require('http')
const database = require('./database')
const main = require('./main')
const env = require('./env')
const log = require('./api/utils/log')(module)
const bcrypt = require('bcryptjs')
const hash = require('util').promisify(bcrypt.hash)

module.exports = async function(app, express) {
  const { sequelize, models } = await database()

  main(app)

  const server = http.Server(app)

  app.locals.app = app
  app.locals.server = server
  app.locals.db = sequelize
  app.locals.models = models

  if (process.send) {
    process.send('ready')
  }
  const { User, Permission } = models
  let user = await User.findOne({
    where: {
      email: env.ADMIN_MAIL
    }
  })
  if (!user) {
    const password = await hash(env.ADMIN_PASSWORD, parseInt(env.API_BCRYPT_LEVEL, 10))
    user = await User.create({
      nickName: 'admin',
      password,
      firstName: 'admin_fname',
      lastName: 'admin_lname',
      email: env.ADMIN_MAIL
    })
    log.info(`Default user '${user.email}' created`)
    let permission = await Permission.create({
      admin: true
    })
    await user.setPermission(permission)
    log.info(`Set default user as admin`)

  } else {
    log.info(`User ${user.email} exist`)
  }

  return app
}
