const errorHandler = require('../../utils/errorHandler')
const isAuth = require('../../middlewares/isAuth')
const isValide = require('../../middlewares/isValide')

/**
 * GET /tinders/users
 *
 * Response:
 * [
 *    {
 *      id, nickName, firstName, catchphrase, image
 *    }, ...
 * ]
 */
module.exports = app => {
  app.get('/tinders/users', [isAuth('tinders-users'), isValide('tinders-users')])
  app.get('/tinders/users', async (req, res) => {
    try {
      const { User } = req.app.locals.models
      let users = await User.findAll({
        attributes: ['id', 'nickName', 'firstName', 'catchphrase', 'image']
      })
      users = users.filter(u => u.image)
      return res
        .status(200)
        .json(users)
        .end()
    } catch (err) {
      errorHandler(err, res)
    }
  })
}
