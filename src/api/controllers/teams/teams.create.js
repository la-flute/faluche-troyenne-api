const errorHandler = require('../../utils/errorHandler')
const { check } = require('express-validator/check')
const validateBody = require('../../middlewares/validateBody')
const isAuth = require('../../middlewares/isAuth')
const isAdmin = require('../../middlewares/isAdmin')

/**
 * POST /teams
 * 
 * Body : 
 * 
 * { name }
 *
 * Response:
 * {
 *    id, name, updatedAt, createdAt
 * }
 */
module.exports = app => {

  app.post('/teams', [isAuth(), isAdmin()])
  app.post('/teams', [
    check('name')
      .exists(),
    validateBody()
  ])
  app.post('/teams', async (req, res) => {
    const { Team } = req.app.locals.models

    try {
      let team = await Team.create(req.body)
      return res
        .status(200)
        .json(team)
        .end()
    } catch (err) {
      errorHandler(err, res)
    }
  })
}