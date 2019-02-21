const errorHandler = require('../../utils/errorHandler')
const isAuth = require('../../middlewares/isAuth')
const isAdmin = require('../../middlewares/isAdmin')

/**
 * DELETE /teams/:id/users/:userId
 */
module.exports = app => {

  app.delete('/teams/:id/users/:userId', [isAuth(), isAdmin()])
  app.delete('/teams/:id/users/:userId', async (req, res) => {
    const { Team, User } = req.app.locals.models

    try {
      let team = await Team.findById(req.params.id, {
        include: [User]
      })
      if (!team) {
        return res
          .status(404)
          .json({ error: 'Team not found' })
          .end()
      }
      let user = team.users.find(u => u.id === req.params.userId)
      if (!user) {
        return res
          .status(404)
          .json({ error: 'User not in team' })
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