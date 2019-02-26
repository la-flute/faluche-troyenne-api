const isAuth = require('../../middlewares/isAuth')
const errorHandler = require('../../utils/errorHandler')
const log = require('../../utils/log')(module)
const pick = require('lodash.pick')
/**
 * GET /user
 *
 * Response:
 * {
 *    user: User
 * }
 */
module.exports = app => {
  app.get('/user', [isAuth('user-recap')])

  app.get('/user', async (req, res) => {
    try {
      const { Order, User } = req.app.locals.models
      log.info(`user ${req.user.email} checked his infos`)
      req.user.order = await Order.findOne({
        where: {
          paid: 1,
          userId: req.user.id
        }
      })
      let result = pick(req.user, [
        'id',
        'nickName',
        'firstName',
        'lastName',
        'email',
        'town',
        'studies',
        'phone',
        'referent_lastName',
        'referent_firstName',
        'referent_phone',
        'address',
        'isMajeur',
        'allergies',
        'folklore',
        'trajet',
        'trajet_commentaire',
        'order',
        'bedroomId',
        'teamId',
        'permission',
        'attestation',
        'regime'
      ])
      if (req.user.referentId) {
        result.referent = await User.findById(req.user.referentId)
        result.referent = `${result.referent.lastName[0].toUpperCase()}. ${
          result.referent.firstName
        }${
          result.referent.nickName ? ' "' + result.referent.nickName + '"' : ''
        }`
      }
      result.permission = result.permission
        ? pick(result.permission, ['admin', 'bureau', 'treso', 'write'])
        : null
      res
        .status(200)
        .json(result)
        .end()
    } catch (err) {
      errorHandler(err, res)
    }
  })
}
