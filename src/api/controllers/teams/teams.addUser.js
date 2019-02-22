const errorHandler = require('../../utils/errorHandler')
const { check } = require('express-validator/check')
const validateBody = require('../../middlewares/validateBody')
const isAuth = require('../../middlewares/isAuth')
const isAdmin = require('../../middlewares/isAdmin')

/**
 * POST /teams/:id/users
 * 
 * Body : 
 * 
 * { userId }
 *
 */
module.exports = app => {

  app.post('/teams/:id/users', [isAuth(), isAdmin()])
  app.post('/teams/:id/users', [
    check('userId')
      .exists(),
    validateBody()
  ])
  app.post('/teams/:id/users', async (req, res) => {
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
      let user = await User.findById(req.body.userId)
      if (!user) {
        return res
          .status(404)
          .json({ error: 'User not found' })
          .end()
      }
      if (team.users.find(u => u.id === user.id)) {
        return res
          .status(400)
          .json({ error: 'User already in team' })
          .end()
      }
      if (user.teamId) {
        return res
          .status(400)
          .json({ error: 'User already has a team' })
          .end()
      }
      await team.addUser(user)
      return res
        .status(200)
        .json('OK')
        .end()
    } catch (err) {
      errorHandler(err, res)
    }
  })
}