const errorHandler = require('../../utils/errorHandler')
const isAuth = require('../../middlewares/isAuth')
const isOrga = require('../../middlewares/isOrga')
const env = require('../../../env')

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
  app.get('/prices', [isAuth('prices-list'), isOrga('prices-list')])
  app.get('/prices', async (req, res) => {
    const { Price } = req.app.locals.models

    try {
      let prices = await Price.findAll({
        attributes: ['id', 'name', 'value', 'start', 'end'],
      })
      return res
        .status(200)
        .json({
          prices,
          bacchusTroueReduc: env.BACCHUS_TROUE_REDUC,
          bedroomSupplement: env.BEDROOM_SUPPLEMENT,
        })
        .end()
    } catch (err) {
      errorHandler(err, res)
    }
  })
}
