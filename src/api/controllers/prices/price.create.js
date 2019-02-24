const errorHandler = require('../../utils/errorHandler')
const { check } = require('express-validator/check')
const validateBody = require('../../middlewares/validateBody')
const isAuth = require('../../middlewares/isAuth')
const isAdmin = require('../../middlewares/isAdmin')
const moment = require('moment')

/**
 * POST /prices
 *
 * Body :
 *
 * { name, value, start, end }
 *
 * Response:
 * {
 *    id, name, value, start, end, updatedAt, createdAt
 * }
 */
module.exports = app => {
  app.post('/prices', [isAuth('price-create'), isAdmin('price-create')])
  app.post('/prices', [
    check('name').exists(),
    check('value')
      .isNumeric()
      .exists(),
    check('start').exists(),
    check('end').exists(),
    validateBody()
  ])
  app.post('/prices', async (req, res) => {
    const { Price } = req.app.locals.models
    try {
      const { start, end } = req.body
      let price = await Price.create({
        ...req.body,
        start: new Date(start),
        end: new Date(end),
      })
      return res
        .status(200)
        .json(price)
        .end()
    } catch (err) {
      errorHandler(err, res)
    }
  })
}
