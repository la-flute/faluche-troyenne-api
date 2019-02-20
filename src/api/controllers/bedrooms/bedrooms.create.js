const errorHandler = require('../../utils/errorHandler')
const { check } = require('express-validator/check')
const validateBody = require('../../middlewares/validateBody')

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

  app.post('/bedrooms', [
    check('number')
      .isNumeric()
      .exists(),
    check('floor')
      .isNumeric()
      .exists(),
    check('places')
      .isNumeric()
      .exists(),
    validateBody()
  ])
  app.post('/bedrooms', async (req, res) => {
    const { Bedroom } = req.app.locals.models

    try {
      let bedroom = await Bedroom.create(req.body)
      return res
        .status(200)
        .json(bedroom)
        .end()
    } catch (err) {
      errorHandler(err, res)
    }
  })
}