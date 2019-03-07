const errorHandler = require('../../utils/errorHandler')
const { check } = require('express-validator/check')
const validateBody = require('../../middlewares/validateBody')
const isAuth = require('../../middlewares/isAuth')
const isValide = require('../../middlewares/isValide')

/**
 * POST /tinders
 *
 * Body :
 *
 * { type }
 *
 * Response: 'MATCH'
 */
module.exports = app => {
  app.post('/tinders', [isAuth('tinder'), isValide('tinder')])
  app.post('/tinders', [
    check('type').exists(),
    check('userId').exists(),
    validateBody()
  ])
  app.post('/tinders', async (req, res) => {
    const { Tinder } = req.app.locals.models
    try {
      const { type } = req.body
      if (type !== 'like' && type !== 'dislike' && type !== 'turbolike')
        return res
          .status(400)
          .json({ error: 'WRONG_TYPE' })
          .end()
      if (type === 'turbolike') {
        const turbolikes = await Tinder.findAll({
          attributes: ['id'],
          where: { type: 'turbolike', userId: req.user.id }
        })
        if (turbolikes.length >= 3)
          return res
            .status(400)
            .json({ error: 'NO_MORE_TURBOLIKES' })
            .end()
      }
      await Tinder.create({
        userId: req.user.id,
        likedId: req.body.userId,
        type
      })
      if (type === 'like') {
        const found = await Tinder.findOne({
          attributes: ['id'],
          where: { type: 'like', likedId: req.user.id, userId: req.body.userId }
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
