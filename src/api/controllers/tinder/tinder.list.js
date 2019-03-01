const errorHandler = require('../../utils/errorHandler')
const isAuth = require('../../middlewares/isAuth')

/**
 * GET /tinders
 *
 * Response:
 * [
 *    { id, name, firstname, lastname, email, paid, }, ...
 * ]
 */
module.exports = app => {
  app.get('/tinders', [isAuth('tinders-list')])
  app.get('/tinders', async (req, res) => {
    try {
      const { User, Tinder } = req.app.locals.models
      let users = await User.findAll({
        attributes: ['id', 'nickName', 'firstName', 'image']
      })
      const tinders = await Tinder.findAll({
        where: { userId: req.user.id },
        attributes: ['likedId']
      })
      const actioned = tinders.map(t => t.likedId)
      users = users
        .filter(u => u.image)
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
