const { check } = require('express-validator/check')
const validateBody = require('../../middlewares/validateBody')
const isAuth = require('../../middlewares/isAuth')
const env = require('../../../env')
const errorHandler = require('../../utils/errorHandler')
const Base64 = require('js-base64').Base64
const moment = require('moment')
const etupay = require('@ung/node-etupay')({
  id: env.ETUPAY_ID,
  url: env.ETUPAY_URL,
  key: env.ETUPAY_KEY
})

const Basket = etupay.Basket

const euro = 100

/**
 * POST /user/pay
 * {
 *    alcool: Boolean,
 *    bedroom: Boolean,
 * }
 *
 * Response:
 * {
 *    url: String
 * }
 */
module.exports = app => {
  app.post('/user/pay', [isAuth('user-pay')])

  app.post('/user/pay', [
    check('alcool')
      .exists()
      .isBoolean(),
    check('bedroom')
      .exists()
      .isBoolean(),
    validateBody()
  ])

  app.post('/user/pay', async (req, res) => {
    // TODO vérifier s'il reste des places dans une chambre avant de valider l'achat d'une place en chambre
    try {
      if (env.PAYMENT_DISABLED === '1')
        return res
          .status(404)
          .json({ error: 'PAYMENT_DISABLED' })
          .end()
      const { User, Order, Price } = req.app.locals.models
      let totalPaidUsers = await User.findAll({
        attributes: ['id'],
        include: [Order]
      })
      totalPaidUsers = totalPaidUsers
        .filter(user => user.order && user.order.paid === true)

      if (totalPaidUsers.length >= env.MAX_PLACES)
        return res
          .status(404)
          .json({ error: 'CONGRES_FULL' })
          .end()

      const found = await Order.findOne({
        where: {
          paid: 1,
          userId: req.user.id
        }
      })
      if (found)
        return res
          .status(404)
          .json('ALREADY_PAID')
          .end()

      // step 1 : create user's order
      let order = req.body

      order = await Order.create(order)
      order.setUser(req.user)

      // step 2 : determine price
      const data = Base64.encode(
        JSON.stringify({
          userId: req.user.id,
          orderId: order.id
        })
      )
      let prices = await Price.findAll({
        attributes: ['id', 'value', 'start', 'end']
      })
      let price = prices.find(
        p => moment().isAfter(p.start) && moment().isBefore(p.end)
      )
      if (!price)
        return res
          .status(403)
          .json('NO_PALIER')
          .end()
      price = price.value
      const basket = new Basket(
        'Inscription WET3',
        req.user.firstName,
        req.user.lastName,
        req.user.email,
        'checkout',
        data
      )
      if (order.alcool) basket.addItem('Place WET3', euro * price, 1)
      else
        basket.addItem(
          'Place WET3 Bacchus troué',
          euro * price - env.BACCHUS_TROUE_REDUC,
          1
        )

      if (order.bedroom)
        basket.addItem('Chambre', env.BEDROOM_SUPPLEMENT * euro, 1)
      return res
        .status(200)
        .json({ url: basket.compute() })
        .end()
    } catch (err) {
      errorHandler(err, res)
    }
  })
}
