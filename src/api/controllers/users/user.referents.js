const log = require('../../utils/log')(module)
const errorHandler = require('../../utils/errorHandler')
const isAuth = require('../../middlewares/isAuth')

/**
 * GET /users
 *
 * Response:
 * [
 *    { id, name, firstname, lastname, email, paid, }, ...
 * ]
 */
module.exports = app => {
  app.get('/users', isAuth('users-referents'))
  app.get('/users/referents', async (req, res) => {
    try {
      const { User } = req.app.locals.models
      let users = await User.findAll({
        attributes: [
          'id',
          'firstName',
          'nickName',
          'town',
          'studies',
          'folklore'
        ],
        order: [['town', 'ASC'], ['firstName', 'ASC']]
      })
      users = users.filter(
        user =>
          user.town &&
          (user.folklore === 'faluchard' || user.folklore === 'autre')
      )
      return res
        .status(200)
        .json(users)
        .end()
    } catch (err) {
      errorHandler(err, res)
    }
  })
}
