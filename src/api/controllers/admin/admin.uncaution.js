const errorHandler = require('../../utils/errorHandler')
const isAuth = require('../../middlewares/isAuth')
const isTreso = require('../../middlewares/isTreso')

/**
 * DELETE /admin/caution/:id
 *
 *
 */
module.exports = app => {
  app.delete('/admin/caution/:userId', [
    isAuth('admin-caution'),
    isTreso('admin-caution/:userId'),
  ])
  app.delete('/admin/caution/:userId', async (req, res) => {
    const { User } = req.app.locals.models
    try {
      const { userId } = req.params
      let user = await User.findById(userId)
      if (!user)
        return res
          .status(404)
          .json({ error: 'NOT_FOUND' })
          .end()
      user.caution = false
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
