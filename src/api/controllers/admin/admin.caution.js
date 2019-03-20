const errorHandler = require('../../utils/errorHandler')
const { check } = require('express-validator/check')
const validateBody = require('../../middlewares/validateBody')
const isAuth = require('../../middlewares/isAuth')
const isTreso = require('../../middlewares/isTreso')

/**
 * POST /admin/caution
 *
 * Body :
 *
 * { userId }
 *
 */
module.exports = app => {
  app.post('/admin/caution', [
    isAuth('admin-caution'),
    isTreso('admin-caution'),
  ])
  app.post('/admin/caution', [
    check('userId')
      .isUUID()
      .exists(),
    validateBody(),
  ])
  app.post('/admin/caution', async (req, res) => {
    const { User } = req.app.locals.models
    try {
      const { userId } = req.body
      let user = await User.findById(userId)
      if (!user)
        return res
          .status(404)
          .json({ error: 'NOT_FOUND' })
          .end()
      user.caution = true
      await user.save()
      return res
        .status(200)
        .json('OK')
        .end()
    } catch (err) {
      errorHandler(err, res)
    }
  })
}
