const errorHandler = require('../../utils/errorHandler')
const { check } = require('express-validator/check')
const validateBody = require('../../middlewares/validateBody')
const isAuth = require('../../middlewares/isAuth')

/**
 * POST /users/:id/tinder
 *
 * Body :
 *
 * { type }
 *
 * Response: 'match'
 */
module.exports = app => {
  app.post('/users/:id/tinder', [isAuth('tinder')])
  app.post('/users/:id/tinder', [check('type').exists(), validateBody()])
  app.post('/users/:id/tinder', async (req, res) => {
    const { Tinder } = req.app.locals.models
    try {
      const { type } = req.body
      if (type !== 'like' && type !== 'dislike' && type !== 'turbolike')
        return res
          .status(400)
          .json({ error: 'WRONG_TYPE' })
          .end()
      await Tinder.create({
        userId: req.user.id,
        likedId: req.params.id,
        type
      })
      if (type === 'like') {
        const found = await Tinder.findOne({
          attributes: ['id'],
          where: { type: 'like', likedId: req.user.id, userId: req.params.id }
        })
        if (found)
          return res
            .status(200)
            .json('MATCH')
            .end()
      }
      return res.status(200).end()
    } catch (err) {
      errorHandler(err, res)
    }
  })
}
