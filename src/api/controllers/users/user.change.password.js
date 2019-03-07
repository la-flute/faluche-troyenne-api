const { check } = require('express-validator/check')
const bcrypt = require('bcryptjs')
const validateBody = require('../../middlewares/validateBody')
const env = require('../../../env')
const errorHandler = require('../../utils/errorHandler')
const log = require('../../utils/log')(module)
const isAuth = require('../../middlewares/isAuth')

/**
 * PUT /user/password
 * {
 *    oldpassword: String
 *    password: String
 * }
 *
 * Response:
 * {
 *
 * }
 *
 */
module.exports = app => {


  app.put('/user/password', [isAuth('user-change-password')])

  app.put('/user/password', [
    check('oldpassword')
      .exists()
      .isLength({ min: 6 }),
    check('password')
      .exists()
      .isLength({ min: 6 }),
    validateBody()
  ])

  app.put('/user/password', async (req, res) => {
    try {


      const passwordMatches = await bcrypt.compare(req.body.oldpassword, req.user.password)
      if (!passwordMatches) {
        return res
          .status(400)
          .json({ error: 'INVALID_PASSWORD' })
          .end()
      }
      

      req.user.password = await bcrypt.hash(
        req.body.password,
        parseInt(env.API_BCRYPT_LEVEL, 10)
      )

      await req.user.save()

      log.info(`user ${req.user.email} changed his password`)

      res
        .status(200)
        .json('OK')
        .end()
    } catch (err) {
      errorHandler(err, res)
    }
  })
}
