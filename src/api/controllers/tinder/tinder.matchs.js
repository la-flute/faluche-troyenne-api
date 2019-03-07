const errorHandler = require('../../utils/errorHandler')
const isAuth = require('../../middlewares/isAuth')
const Sequelize = require('sequelize')
const Op = Sequelize.Op
const isValide = require('../../middlewares/isValide')

/**
 * GET /tinders/matchs
 *
 * Response:
 * [
 *    {
 *      id, firstName, nickName, turbolike
 *    }, ...
 * ]
 */
module.exports = app => {
  app.get('/tinders/matchs', [isAuth('tinders-matchs'), isValide('tinders-match')])
  app.get('/tinders/matchs', async (req, res) => {
    try {
      const { Tinder } = req.app.locals.models
      let liked = await Tinder.findAll({
        attributes: ['likedId'],
        where: { userId: req.user.id, type: 'like' }
      })
      let likedBy = await Tinder.findAll({
        attributes: ['userId'],
        where: { likedId: req.user.id, type: 'like' }
      })
      let turboLiked = await Tinder.findAll({
        attributes: ['likedId', 'userId'],
        where: {
          [Op.or]: [{ userId: req.user.id }, { likedId: req.user.id }],
          type: 'turbolike'
        }
      })
      liked = liked.map(l => l.likedId)
      likedBy = likedBy.map(l => l.userId)
      let matchs = []
      liked.forEach(l =>
        likedBy.forEach(lb => {
          if (l === lb) matchs.push({ id: l })
        })
      )
      turboLiked.forEach(tl => {
        if (tl.userId === req.user.id) {
          matchs.push({
            id: tl.likedId,
            turboliked: true
          })
        } else {
          matchs.push({
            id: tl.userId,
            turbolikedBy: true
          })
        }
      })
      return res
        .status(200)
        .json(matchs)
        .end()
    } catch (err) {
      errorHandler(err, res)
    }
  })
}
