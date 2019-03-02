const errorHandler = require('../../utils/errorHandler')
const isAuth = require('../../middlewares/isAuth')

/**
 * GET /targets/top
 *
 * Response:
 * [
 *    {id, number},...
 * ]
 */
module.exports = app => {
  app.get('/targets/top', [isAuth('targets-top')])
  app.get('/targets/top', async (req, res) => {
    try {
      const { Target } = req.app.locals.models
      let alltargets = await Target.findAll({
        attributes: ['targetedId'],
        where: { type: 'target' },
        order: [['targetedId', 'ASC']]
      })
      let mostTargeted = [],
        b = [],
        prev
      alltargets = alltargets.map(l => l.targetedId)
      for (var i = 0; i < alltargets.length; i++) {
        if (alltargets[i] !== prev) {
          mostTargeted.push(alltargets[i])
          b.push(1)
        } else {
          b[b.length - 1]++
        }
        prev = alltargets[i]
      }

      mostTargeted = mostTargeted
        .map((t, index) => {
          return { id: t, number: b[index] }
        })
        .sort((a, b) => {
          if (a.number > b.number) return -1
          if (a.number < b.number) return 1
          return 0
        })
      
      return res
        .status(200)
        .json(mostTargeted)
        .end()
    } catch (err) {
      errorHandler(err, res)
    }
  })
}
