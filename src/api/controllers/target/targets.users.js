const errorHandler = require('../../utils/errorHandler')
const isAuth = require('../../middlewares/isAuth')
const isValide = require('../../middlewares/isValide')

/**
 * GET /targets/users
 *
 * Response:
 * [
 *    {
 *      id, nickName, firstName, catchphrase, image
 *    }, ...
 * ]
 */
module.exports = app => {
  app.get('/targets/users', [isAuth('targets-users'), isValide('targets-users')])
  app.get('/targets/users', async (req, res) => {
    try {
      const { User } = req.app.locals.models
      let users = await User.findAll({
        attributes: ['id', 'nickName', 'firstName', 'image', 'town']
      })
      users = users.filter(u => u.town)
      return res
        .status(200)
        .json(users)
        .end()
    } catch (err) {
      errorHandler(err, res)
    }
  })
}
