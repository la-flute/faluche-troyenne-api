const errorHandler = require('../../utils/errorHandler')
const isAuth = require('../../middlewares/isAuth')

/**
 * GET /tinders/top
 *
 * Response:
 * [
 *    {
 *      mostLiked: [
 *        {
 *          id, number
 *        },...
 *      ],
 *      mostTurboLiked: [
 *        {
 *          id, number
 *        },...
 *      ]
 *    }, ...
 * ]
 */
module.exports = app => {
  app.get('/tinders/top', [isAuth('tinders-top')])
  app.get('/tinders/top', async (req, res) => {
    try {
      const { Tinder } = req.app.locals.models
      let allLikes = await Tinder.findAll({
        attributes: ['likedId'],
        where: { type: 'like' },
        order: [['likedId', 'ASC']]
      })
      let allTurboLikes = await Tinder.findAll({
        attributes: ['likedId'],
        where: { type: 'turbolike' },
        order: [['likedId', 'ASC']]
      })
      let mostLiked = [],
        mostTurboLiked = [],
        b = [],
        prev
      allLikes = allLikes.map(l => l.likedId)
      allTurboLikes = allTurboLikes.map(l => l.likedId)
      for (var i = 0; i < allLikes.length; i++) {
        if (allLikes[i] !== prev) {
          mostLiked.push(allLikes[i])
          b.push(1)
        } else {
          b[b.length - 1]++
        }
        prev = allLikes[i]
      }
      mostLiked = mostLiked
        .map((t, index) => {
          return { id: t, number: b[index] }
        })
        .sort((a, b) => {
          if (a.number > b.number) return -1
          if (a.number < b.number) return 1
          return 0
        })
        .slice(0, 10)
      b = []
      prev = null
      for (var i = 0; i < allTurboLikes.length; i++) {
        if (allTurboLikes[i] !== prev) {
          mostTurboLiked.push(allTurboLikes[i])
          b.push(1)
        } else {
          b[b.length - 1]++
        }
        prev = allTurboLikes[i]
      }
      mostTurboLiked = mostTurboLiked
        .map((t, index) => {
          return { id: t, number: b[index] }
        })
        .sort((a, b) => {
          if (a.number > b.number) return -1
          if (a.number < b.number) return 1
          return 0
        })
        .slice(0, 10)
      return res
        .status(200)
        .json({ mostLiked, mostTurboLiked })
        .end()
    } catch (err) {
      errorHandler(err, res)
    }
  })
}
