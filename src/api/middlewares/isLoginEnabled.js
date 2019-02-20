const debug = require('debug')('faluche-troyenne-api:loginEnabled')
const env = require('../../env')

module.exports = () =>
  async function(req, res, next) {
    if (env.API_DISABLE_LOGIN === '1') {
      debug(`user tried to login while it's disabled`)

      return res
        .status(403)
        .json({ error: 'DISABLED_LOGIN' })
        .end()
    }

    next()
  }
