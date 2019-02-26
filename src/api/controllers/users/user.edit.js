const { check } = require('express-validator/check')
const validateBody = require('../../middlewares/validateBody')
const isAuth = require('../../middlewares/isAuth')
const errorHandler = require('../../utils/errorHandler')
const log = require('../../utils/log')(module)
const pick = require('lodash.pick')

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
    check('nickName')
      .optional()
      .matches(
        /[0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyzªµºÀÁÂÃÄÅÆÇÈÉÊËÌÍÎÏÐÑÒÓÔÕÖØÙÚÛÜÝÞßàáâãäåæçèéêëìíîïðñòóôõöøùúûüýþÿĄąĆćĘęıŁłŃńŒœŚśŠšŸŹźŻżŽžƒˆˇˉμﬁﬂ \-]+/i
      )
      .isLength({ min: 3, max: 90 }),
    check('lastName')
      .exists()
      .matches(
        /[0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyzªµºÀÁÂÃÄÅÆÇÈÉÊËÌÍÎÏÐÑÒÓÔÕÖØÙÚÛÜÝÞßàáâãäåæçèéêëìíîïðñòóôõöøùúûüýþÿĄąĆćĘęıŁłŃńŒœŚśŠšŸŹźŻżŽžƒˆˇˉμﬁﬂ \-]+/i
      )
      .isLength({ min: 2, max: 200 }),
    check('firstName')
      .exists()
      .matches(
        /[0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyzªµºÀÁÂÃÄÅÆÇÈÉÊËÌÍÎÏÐÑÒÓÔÕÖØÙÚÛÜÝÞßàáâãäåæçèéêëìíîïðñòóôõöøùúûüýþÿĄąĆćĘęıŁłŃńŒœŚśŠšŸŹźŻżŽžƒˆˇˉμﬁﬂ \-]+/i
      )
      .isLength({ min: 2, max: 200 }),
    check('town').exists(),
    check('studies').exists(),
    check('phone').exists(),
    check('referent_lastName').optional(),
    check('referent_firstName').optional(),
    check('referent_phone').optional(),
    check('address').exists(),
    check('isMajeur')
      .isBoolean()
      .exists(),
    check('allergies').optional(),
    check('medication').optional(),
    check('folklore').exists(),
    check('trajet').exists(),
    check('trajet_commentaire').optional(),
    validateBody()
  ])

  app.put('/user', async (req, res) => {
    try {
      if (req.user.town) {
        res
          .status(400)
          .json({ error: 'ALREADY_SUBMITTED' })
          .end()
      }
      await req.user.update(req.body)

      log.info(`user ${req.user.email} updated`)

      res
        .status(200)
        .json(
          pick(req.user, [
            'id',
            'nickName',
            'firstName',
            'lastName',
            'email',
            'town',
            'studies',
            'phone',
            'address',
            'isMajeur',
            'allergies',
            'folklore',
            'trajet',
            'trajet_commentaire',
            'order',
            'bedroomId',
            'teamId'
          ])
        )
        .end()
    } catch (err) {
      errorHandler(err, res)
    }
  })
}
