const errorHandler = require('../../utils/errorHandler')
const { check } = require('express-validator/check')
const validateBody = require('../../middlewares/validateBody')
const isAuth = require('../../middlewares/isAuth')

/**
 * POST /targets
 *
 * Body :
 *
 * { type }
 *
 */
module.exports = app => {
  app.post('/targets', [isAuth('targets')])
  app.post('/targets', [
    check('type').exists(),
    check('userId').exists(),
    validateBody()
  ])
  app.post('/targets', async (req, res) => {
    const { Target } = req.app.locals.models
    try {
      const { type } = req.body
      if (type !== 'target' && type !== 'notTarget')
        return res
          .status(400)
          .json({ error: 'WRONG_TYPE' })
          .end()
      await Target.create({
        userId: req.user.id,
        targetedId: req.body.userId,
        type
      })
      return res.status(200).end()
    } catch (err) {
      errorHandler(err, res)
    }
  })
}
