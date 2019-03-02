const errorHandler = require('../../utils/errorHandler')
const isAuth = require('../../middlewares/isAuth')
const Sequelize = require('sequelize')
const Op = Sequelize.Op
/**
 * GET /targets/matchs
 *
 * Response:
 * [
 *    {
 *      id, firstName, nickName, turbolike
 *    }, ...
 * ]
 */
module.exports = app => {
  app.get('/targets/matchs', [isAuth('targets-matchs')])
  app.get('/targets/matchs', async (req, res) => {
    try {
      const { Target } = req.app.locals.models
      let targetedBy = await Target.findAll({
        attributes: ['userId'],
        where: { targetedId: req.user.id, type: 'target' }
      })
      targetedBy = targetedBy.map(l => l.userId)
      return res
        .status(200)
        .json(targetedBy)
        .end()
    } catch (err) {
      errorHandler(err, res)
    }
  })
}
