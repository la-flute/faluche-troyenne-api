const http = require('http')
const database = require('./database')
const main = require('./main')

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

  return app
}
