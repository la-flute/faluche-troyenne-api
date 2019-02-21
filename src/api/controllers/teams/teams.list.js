const errorHandler = require('../../utils/errorHandler')
const isAuth = require('../../middlewares/isAuth')
const isAdmin = require('../../middlewares/isAdmin')

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
          attributes: ['id', 'name', 'firstName']
        }]
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