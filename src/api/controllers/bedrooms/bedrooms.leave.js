const errorHandler = require('../../utils/errorHandler')
const { check } = require('express-validator/check')
const validateBody = require('../../middlewares/validateBody')
const isAuth = require('../../middlewares/isAuth')
const isAdmin = require('../../middlewares/isAdmin')

/**
 * POST /bedrooms
 * 
 * Body : 
 * 
 * { number, floor, places }
 *
 * Response:
 * {
 *    id, number, floor, places, updatedAt, createdAt
 * }
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
          .json("User has no room")
          .end()
      }
      user.bedroomId = null
      await user.save()
      return res
        .status(200)
        .json("OK")
        .end()
    } catch (err) {
      errorHandler(err, res)
    }
  })
}