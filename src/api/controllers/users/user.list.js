const log = require('../../utils/log')(module)
const errorHandler = require('../../utils/errorHandler')
const isAuth = require('../../middlewares/isAuth')

/**
 * GET /users
 *
 * Response:
 * [
 *    { id, lastName (only first letter), firstName, nickName, town, studies, folklore }, ...
 * ]
 */
module.exports = app => {
  app.get('/users', isAuth('users'))
  app.get('/users', async (req, res) => {
    try {
      const { User } = req.app.locals.models
      let users = await User.findAll({
        attributes: [
          'id',
          'firstName',
          'lastName',
          'nickName',
          'town',
          'studies',
          'folklore'
        ],
        order: [['town', 'ASC'], ['firstName', 'ASC']],
        where: {
          validated: true
        },
        raw: true
      })

      users = users.map(user => {
        return {
          ...user,
          lastName: user.lastName.charAt(0).toUpperCase()
        }
      })
      return res
        .status(200)
        .json(users)
        .end()
    } catch (err) {
      errorHandler(err, res)
    }
  })
}
