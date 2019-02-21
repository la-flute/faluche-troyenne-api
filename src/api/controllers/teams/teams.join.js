const errorHandler = require('../../utils/errorHandler')
const isAuth = require('../../middlewares/isAuth')

/**
 * POST /teams/:id/join
 */
module.exports = app => {

  app.post('/teams/:id/join', [isAuth('team-join')])
  app.post('/teams/:id/join', async (req, res) => {
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
      if (team.users.find(u => u.id === req.user.id)) {
        return res
          .status(400)
          .json({ error: 'User already in team' })
          .end()
      }
      await team.addUser(req.user)
      return res
        .status(200)
        .json('OK')
        .end()
    } catch (err) {
      errorHandler(err, res)
    }
  })
}