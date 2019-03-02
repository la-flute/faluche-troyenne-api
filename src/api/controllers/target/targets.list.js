const errorHandler = require('../../utils/errorHandler')
const isAuth = require('../../middlewares/isAuth')

/**
 * GET /targets
 *
 * Response:
 * [
 *    { id, name, firstname, lastname, email, paid, }, ...
 * ]
 */
module.exports = app => {
  app.get('/targets', [isAuth('targets-list')])
  app.get('/targets', async (req, res) => {
    try {
      const { User, Target } = req.app.locals.models
      let users = await User.findAll({
        attributes: ['id', 'firstName', 'nickName', 'town']
      })
      const targets = await Target.findAll({
        where: { userId: req.user.id },
        attributes: ['targetedId']
      })
      const actioned = targets.map(t => t.targetedId)
      users = users
        .filter(u => u.town)
        .filter(u => u.id !== req.user.id && !actioned.find(a => a === u.id))
      return res
        .status(200)
        .json(users)
        .end()
    } catch (err) {
      errorHandler(err, res)
    }
  })
}
