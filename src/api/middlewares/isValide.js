const jwt = require('jsonwebtoken')
const { promisify } = require('util')
const log = require('../utils/log')(module)

jwt.verify = promisify(jwt.verify)

module.exports = route => async (req, res, next) => {
  if (req.user && req.user.validated) next()
  else
    return res
      .status(401)
      .json({ error: 'NOT_VALIDE', route })
      .end()
}
