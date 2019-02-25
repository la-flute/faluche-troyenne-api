const errorHandler = require('../../utils/errorHandler')
const isAuth = require('../../middlewares/isAuth')
const env = require('../../../env')
const moment = require('moment')

/**
 * GET /prices
 *
 * Response:
 * [
 *    {
 *      id, name, value, start, end
 *
 *    },...
 * ]
 */
module.exports = app => {
  app.get('/price', [isAuth('price')])
  app.get('/price', async (req, res) => {
    const { Price } = req.app.locals.models

    try {
      let prices = await Price.findAll({
        attributes: ['id', 'value', 'start', 'end']
      })
      const p = prices.find(
        price => moment().isAfter(price.start) && moment().isBefore(price.end)
      )
      return res
        .status(200)
        .json({
          price: p,
          bacchusTroueReduc: parseInt(env.BACCHUS_TROUE_REDUC),
          bedroomSupplement: parseInt(env.BEDROOM_SUPPLEMENT)
        })
        .end()
    } catch (err) {
      errorHandler(err, res)
    }
  })
}
