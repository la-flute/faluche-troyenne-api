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

  app.post('/displays', [isAuth(), isAdmin()])
  app.post('/displays', [
    check('name')
      .isString()
      .exists(),
    check('code')
      .isString()
      .exists(),
    check('render')
      .isBoolean()
      .optional(),
    validateBody()
  ])
  app.post('/displays', async (req, res) => {
    const { Display } = req.app.locals.models

    try {
      let display = await Display.create(req.body)
      return res
        .status(200)
        .json(display)
        .end()
    } catch (err) {
      errorHandler(err, res)
    }
  })
}