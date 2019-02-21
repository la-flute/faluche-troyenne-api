const { check } = require('express-validator/check')
const bcrypt = require('bcryptjs')
const jwt = require('jsonwebtoken')

const env = require('../../../env')
const log = require('../../utils/log')(module)
const errorHandler = require('../../utils/errorHandler')
const { outputFields } = require('../../utils/publicFields')
const validateBody = require('../../middlewares/validateBody')
const isLoginEnabled = require('../../middlewares/isLoginEnabled')

/**
 * PUT /user/login
 * {
 *    email: Mail
 *    password: String
 * }
 *
 * Response:
 * {
 *    user: User,
 *    token: String
 * }
 */
module.exports = app => {
  app.put('/user/login', [isLoginEnabled()])

  app.put('/user/login', [
    check('email')
      .exists()
      .isEmail(),
    check('password')
      .exists(),
    validateBody()
  ])

  app.put('/user/login', async (req, res) => {
    const { User } = req.app.locals.models

    try {
      const { email, password } = req.body

      // Get user
      const user = await User.findOne({
        where: {
          email
        }
      })

      if (!user) {
        log.warn(`user with mail ${email} couldn't be found`)

        return res
          .status(400)
          .json({ error: 'INVALID_USERNAME' })
          .end()
      }

      // Check for password
      const passwordMatches = await bcrypt.compare(password, user.password)

      if (!passwordMatches) {
        log.warn(`user (${email}) password didn't match`)

        return res
          .status(400)
          .json({ error: 'INVALID_PASSWORD' })
          .end()
      }

      // Check if account is activated
      if (user.registerToken) {
        log.warn(`user (${email}) tried to login before activating`)

        return res
          .status(400)
          .json({ error: 'USER_NOT_ACTIVATED' })
          .end()
      }

      // Generate new token
      const token = jwt.sign({ id: user.id }, env.API_SECRET, {
        expiresIn: env.API_SECRET_EXPIRES
      })


      log.info(`user ${user.email} logged`)
      const { id, name, email, firstName, lastName } = user
      res
        .status(200)
        .json({
          user: {
            id, name, email, firstName, lastName
        }, token })
        .end()
    } catch (err) {
      errorHandler(err, res)
    }
  })
}
