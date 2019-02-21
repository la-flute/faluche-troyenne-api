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

  app.post('/bedrooms/:id/users', [isAuth(), isAdmin()])
  app.post('/bedrooms/:id/users', [
    check('userId')
      .exists(),
    check('force')
      .optional(),
    validateBody()
  ])
  app.post('/bedrooms/:id/users', async (req, res) => {
    const { Bedroom, User } = req.app.locals.models

    try {
      let bedroom = await Bedroom.findById(req.params.id, {
        include: [User]
      })
      if (!bedroom) {
        return res
          .status(404)
          .json({ error: 'Bedroom not found' })
          .end()
      }
      let user = await User.findById(req.body.userId)
      if (!user) {
        return res
          .status(404)
          .json({ error: 'User not found' })
          .end()
      }
      if (bedroom.users.find(u => u.id === user.id)) {
        return res
          .status(400)
          .json({ error: 'User already in room' })
          .end()
      }
      if (!req.body.force && bedroom.places <= bedroom.users.length) {
        return res
          .status(400)
          .json({ error: 'Bedroom full' })
          .end()
      }
      await bedroom.addUser(user)
      return res
        .status(200)
        .json('OK')
        .end()
    } catch (err) {
      errorHandler(err, res)
    }
  })
}