const errorHandler = require('../../utils/errorHandler')
const isAuth = require('../../middlewares/isAuth')
const isTreso = require('../../middlewares/isAdmin')

/**
 * POST /admin/forcepay
 *
 * Body :
 *
 * { userId }
 *
 */
module.exports = app => {
  app.delete('/admin/forcepay/:userId', [
    isAuth('admin-forcepay'),
    isTreso('admin-forcepay/:userId'),
  ])
  app.delete('/admin/forcepay/:userId', async (req, res) => {
    const { Order } = req.app.locals.models
    try {
      const { userId } = req.params
      let order = await Order.findOne({ where: { userId, paid: 1 } })
      if (!order)
        return res
          .status(404)
          .json({ error: 'NOT_FOUND' })
          .end()
      order.paid = false
      order.transactionState = 'canceled'
      await order.save()
      return res
        .status(200)
        .json('OK')
        .end()
    } catch (err) {
      errorHandler(err, res)
    }
  })
}
