const { check } = require('express-validator/check')
const bcrypt = require('bcryptjs')
const uuid = require('uuid')
const validateBody = require('../../middlewares/validateBody')
const isLoginEnabled = require('../../middlewares/isLoginEnabled')
const mail = require('../../mail')
const env = require('../../../env')
const errorHandler = require('../../utils/errorHandler')
const log = require('../../utils/log')(module)

const hash = require('util').promisify(bcrypt.hash)

/**
 * POST /user
 * {
 *    firstName: String
 *    lastName: String
 *    password: String
 *    email: String
 * }
 *
 * Response:
 * {
 *
 * }
 */
module.exports = app => {
  app.post('/user', [isLoginEnabled()])

  app.post('/user', [
    check('lastName')
      .exists()
      .matches(/[0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyzªµºÀÁÂÃÄÅÆÇÈÉÊËÌÍÎÏÐÑÒÓÔÕÖØÙÚÛÜÝÞßàáâãäåæçèéêëìíîïðñòóôõöøùúûüýþÿĄąĆćĘęıŁłŃńŒœŚśŠšŸŹźŻżŽžƒˆˇˉμﬁﬂ \-]+/i)
      .isLength({ min: 2, max: 200 }),
    check('firstName')
      .exists()
      .matches(/[0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyzªµºÀÁÂÃÄÅÆÇÈÉÊËÌÍÎÏÐÑÒÓÔÕÖØÙÚÛÜÝÞßàáâãäåæçèéêëìíîïðñòóôõöøùúûüýþÿĄąĆćĘęıŁłŃńŒœŚśŠšŸŹźŻżŽžƒˆˇˉμﬁﬂ \-]+/i)
      .isLength({ min: 2, max: 200 }),
    check('password')
      .exists()
      .isLength({ min: 6 }),
    check('email')
      .exists()
      .isEmail(),
    validateBody()
  ])

  app.post('/user', async (req, res) => {
    const { User } = req.app.locals.models

    try {
      req.body.password = await hash(req.body.password, parseInt(env.API_BCRYPT_LEVEL, 10))

      req.body.registerToken = uuid()
      const user = await User.create(req.body)

      log.info(`user ${user.email} created`)
      await mail('user.register', user.email, {
        mail: user.email,
        link: `${env.WEBSITE}/valid/${user.registerToken}`
      })

      log.info(`mail sent to ${user.email}`)

      res
        .status(200)
        .json('OK')
        .end()
    } catch (err) {
      errorHandler(err, res)
    }
  })
}
