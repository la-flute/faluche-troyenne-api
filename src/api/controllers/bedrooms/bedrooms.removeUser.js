const errorHandler = require('../../utils/errorHandler')
const { check } = require('express-validator/check')
const validateBody = require('../../middlewares/validateBody')
const isAuth = require('../../middlewares/isAuth')
const isAdmin = require('../../middlewares/isAdmin')

/**
 * DELETE /bedrooms
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

  app.delete('/bedrooms/:id/users/:userId', [isAuth(), isAdmin()])
  app.delete('/bedrooms/:id/users/:userId', async (req, res) => {
    const { Bedroom, User } = req.app.locals.models

    try {
      let bedroom = await Bedroom.findById(req.params.id, {
        include: [User]
      })
      if (!bedroom) {
        return res
          .status(404)
          .json("Bedroom not found")
          .end()
      }
      let user = bedroom.users.find(u => u.id === req.params.userId)
      if (!user) {
        return res
          .status(404)
          .json("User not in bedroom")
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