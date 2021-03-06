const errorHandler = require('../../utils/errorHandler')
const isAuth = require('../../middlewares/isAuth')

/**
 * POST /bedrooms/:id/leave
 */
module.exports = app => {

  app.post('/bedrooms/:id/leave', [isAuth()])
  app.post('/bedrooms/:id/leave', async (req, res) => {
    const { Bedroom, User } = req.app.locals.models

    try {
      let user = await User.findById(req.user.id, {
        include: [Bedroom]
      })
      if (!user.bedroom) {
        return res
          .status(404)
          .json({ error: 'User has no room' })
          .end()
      }
      user.bedroomId = null
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