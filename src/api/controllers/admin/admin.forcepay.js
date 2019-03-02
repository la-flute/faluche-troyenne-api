const errorHandler = require('../../utils/errorHandler')
const { check } = require('express-validator/check')
const validateBody = require('../../middlewares/validateBody')
const isAuth = require('../../middlewares/isAuth')
const isAdmin = require('../../middlewares/isAdmin')
const moment = require('moment')

/**
 * POST /admin/forcepay
 *
 * Body :
 *
 * { userId, alcool, bedroom }
 *
 */
module.exports = app => {
  app.post('/admin/forcepay', [
    isAuth('admin-forcepay'),
    isAdmin('admin-forcepay')
  ])
  app.post('/admin/forcepay', [
    check('userId').exists(),
    check('alcool').exists(),
    check('bedroom').exists(),
    validateBody()
  ])
  app.post('/admin/forcepay', async (req, res) => {
    const { Order } = req.app.locals.models
    try {
      const { userId, alcool, bedroom } = req.body
      let order = await Order.create({
        paid: 1,
        alcool, 
        bedroom,
        transactionState: 'forced'
      })
      order.setUser(userId)
      return res
        .status(200)
        .json('OK')
        .end()
    } catch (err) {
      errorHandler(err, res)
    }
  })
}