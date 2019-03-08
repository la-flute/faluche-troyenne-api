const errorHandler = require('../../utils/errorHandler')
const isAuth = require('../../middlewares/isAuth')

/**
 * GET /teams
 *
 * Response:
 * [
 *    {
 *      id,
 *      name,
 *      users: [id1, id2, ...]
 *    },...
 * ]
 */
module.exports = app => {

  app.get('/teams', [isAuth('teams-list')])
  app.get('/teams', async (req, res) => {
    const { Team, User } = req.app.locals.models

    try {
      let teams = await Team.findAll({
        attributes: ['id', 'name'],
        include: [{
          model: User,
          attributes: ['id', 'nickName', 'firstName', 'lastName', 'town', 'studies']
        }]
      })
      teams = teams.map(team => {
        team.users = team.users.map(user => {
          user.lastName = user.lastName[0].toUpperCase()
          return user
        })
        return team
      })
      return res
        .status(200)
        .json(teams)
        .end()
    } catch (err) {
      errorHandler(err, res)
    }
  })
}