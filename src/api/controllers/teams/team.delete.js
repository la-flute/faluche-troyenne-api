const errorHandler = require('../../utils/errorHandler')
const isAuth = require('../../middlewares/isAuth')
const isAdmin = require('../../middlewares/isAdmin')

/**
 * DELETE /teams/:id
 *
 */
module.exports = app => {
  app.delete('/teams/:id', [isAuth(), isAdmin('team-delete')])
  app.delete('/teams/:id', async (req, res) => {
    const { Team } = req.app.locals.models

    try {
      let team = await Team.findById(req.params.id)
      if (!team) {
        return res
          .status(404)
          .json({ error: 'TEAM_NOT_FOUND' })
          .end()
      }
      await team.destroy()
      return res
        .status(200)
        .json('OK')
        .end()
    } catch (err) {
      errorHandler(err, res)
    }
  })
}
