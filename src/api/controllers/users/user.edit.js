const bcrypt = require('bcryptjs')
const { check } = require('express-validator/check')
const validateBody = require('../../middlewares/validateBody')
const isAuth = require('../../middlewares/isAuth')
const env = require('../../../env')
const errorHandler = require('../../utils/errorHandler')
const { outputFields } = require('../../utils/publicFields')
const log = require('../../utils/log')(module)

/**
 * PUT /user
 * {
 *    email: String
 *    [password]: String
 * }
 *
 * Response:
 * {
 *    user: User
 * }
 */
module.exports = app => {
  app.put('/user', [isAuth('user-edit')])

  app.put('/user', [
    check('name')
      .optional()
      .matches(/[0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyzªµºÀÁÂÃÄÅÆÇÈÉÊËÌÍÎÏÐÑÒÓÔÕÖØÙÚÛÜÝÞßàáâãäåæçèéêëìíîïðñòóôõöøùúûüýþÿĄąĆćĘęıŁłŃńŒœŚśŠšŸŹźŻżŽžƒˆˇˉμﬁﬂ \-]+/i)
      .isLength({ min: 3, max: 90 }),
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
    check('town')
      .exists(),
    check('studies')
      .exists(),
    check('phone')
      .exists(),
    check('address')
      .exists(),
    check('isMajeur')
      .isBoolean()
      .exists(),
    check('allergies')
      .exists(),
    check('folklore')
      .exists(),
    check('trajet')
      .exists(),
    check('trajet_commentaire')
      .optional(),
    validateBody()
  ])

  app.put('/user', async (req, res) => {
    try {
      req.body.password = await bcrypt.hash(
        req.body.password,
        parseInt(env.API_BCRYPT_LEVEL, 10)
      )
      

      await req.user.update(req.body)

      log.info(`user ${req.body.email} updated`)

      res
        .status(200)
        .json({ user: outputFields(req.user) })
        .end()
    } catch (err) {
      errorHandler(err, res)
    }
  })
}
