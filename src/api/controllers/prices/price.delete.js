const errorHandler = require('../../utils/errorHandler')
const isAuth = require('../../middlewares/isAuth')
const isAdmin = require('../../middlewares/isAdmin')

/**
 * DELETE /prices/:id
 *
 */
module.exports = app => {
  app.delete('/prices/:id', [isAuth('price-delete'), isAdmin('price-delete')])
  app.delete('/prices/:id', async (req, res) => {
    const { Price } = req.app.locals.models

    try {
      let price = await Price.findById(req.params.id)
      if (!price) {
        return res
          .status(404)
          .json({ error: 'PRICE_NOT_FOUND' })
          .end()
      }
      await price.destroy()
      return res
        .status(200)
        .json('OK')
        .end()
    } catch (err) {
      errorHandler(err, res)
    }
  })
}
