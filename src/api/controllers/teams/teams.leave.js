const errorHandler = require('../../utils/errorHandler')
const isAuth = require('../../middlewares/isAuth')

/**
 * POST /teams/:id/leave
 */
module.exports = app => {

  app.post('/teams/:id/leave', [isAuth('team-leave')])
  app.post('/teams/:id/leave', async (req, res) => {
    const { Team, User } = req.app.locals.models

    try {
      let user = await User.findById(req.user.id, {
        include: [Team]
      })
      if (!user.team) {
        return res
          .status(404)
          .json({ error: 'User has no team' })
          .end()
      }
      user.teamId = null
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