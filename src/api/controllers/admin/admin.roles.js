const log = require('../../utils/log')(module)
const errorHandler = require('../../utils/errorHandler')
const isAuth = require('../../middlewares/isAuth')
const isAdmin = require('../../middlewares/isAdmin')

/**
 * GET /admin/listRoles
 *
 * Response:
 * [
 *    { id, name, firstname, lastname, nickName, town }, ...
 * ]
 */
module.exports = app => {
  app.get('/admin/listRoles', async (req, res) => {
    try {
      const { User, Permission } = req.app.locals.models
      const users = await User.findAll({
        attributes: ['id', 'lastName', 'firstName', 'nickName', 'town'],
        include: [{model:Permission, attributes: ['admin', 'treso', 'bureau', 'write']}],
        order: [['town', 'ASC'], ['lastName', 'ASC']]
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
