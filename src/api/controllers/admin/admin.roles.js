const log = require('../../utils/log')(module)
const errorHandler = require('../../utils/errorHandler')
const isAuth = require('../../middlewares/isAuth')
const isAdmin = require('../../middlewares/isAdmin')

module.exports = app => {
  app.get('admin/listRoles', async (req, res) => {
    try {
      const { User, Permission } = req.app.locals.models
      const users = await User.findAll({
        include: [Permission]
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
