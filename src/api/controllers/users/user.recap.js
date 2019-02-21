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
      log.info(`user ${req.user.name} checked his infos`)

      
      res
        .status(200)
        .json(pick(req.user, [
          'id',
          'name',
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
          'trajet_commentaire'
        ]))
        .end()
    } catch (err) {
      errorHandler(err, res)
    }
  })
}
