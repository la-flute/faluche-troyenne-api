const jwt = require('jsonwebtoken')
const { promisify } = require('util')
const env = require('../../env')
const log = require('../utils/log')(module)

jwt.verify = promisify(jwt.verify)

module.exports = route => async (req, res, next) => {
  const { User, Permission } = req.app.locals.models

  const auth = req.get('X-Token')

  console.log(auth)

  if (!auth || auth.length === 0) {
    log.warn('missing token', { route })

    return res
      .status(401)
      .json({ error: 'NO_TOKEN' })
      .end()
  }

  try {
    const decoded = await jwt.verify(auth, env.API_SECRET)

    const user = await User.findById(decoded.id, {
      include: [Permission],
    })
    if (!user) {
      log.warn('invalid token : user not found', { route })
      return res
        .status(401)
        .json({ error: 'INVALID_TOKEN' })
        .end()
    }
    req.user = user

    next()
  } catch (err) {
    log.warn('invalid token', { route })

    return res
      .status(401)
      .json({ error: 'INVALID_TOKEN' })
      .end()
  }
}
