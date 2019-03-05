const env = require('../../../env')
const log = require('../../utils/log')(module)
const moment = require('moment')
const Base64 = require('js-base64').Base64
const mail = require('../../mail')
const etupay = require('@ung/node-etupay')({
  id: env.ETUPAY_ID,
  url: env.ETUPAY_URL,
  key: env.ETUPAY_KEY
})

async function handlePayload(models, payload) {
  let { User, Order } = models
  try {
    const data = JSON.parse(Base64.decode(payload.serviceData))
    const { orderId, userId } = data
    const user = await User.findById(userId)

    if (!user)
      return {
        user: null,
        shouldSendMail: false,
        error: 'NULL_USER',
        transactionState: 'error'
      }
    let order = await Order.findById(orderId)
    if (order.paid)
      return {
        user,
        shouldSendMail: false,
        error: 'ALREADY_PAID',
        transactionState: 'error'
      }

    order.transactionId = payload.transactionId
    order.transactionState = payload.step
    order.paid = payload.paid
    if (order.paid) {
      order.paid_at = moment().format()
    }

    log.info(
      `user ${user.email} is at state ${order.transactionState} for his order ${
        order.id
      }`
    )

    await user.save()
    await order.save()

    return {
      shouldSendMail: order.paid,
      user,
      error: null,
      transactionState: order.transactionState
    }
  } catch (err) {
    const body = JSON.stringify(payload, null, 2)

    log.info(`handle payload error: ${body}`)
    return {
      user: null,
      shouldSendMail: false,
      error: body,
      transactionState: 'error'
    }
  }
}

/**
 * POST /pay/callback
 * {
 *    etupay data
 * }
 *
 * Response:
 * {
 *
 * }
 */
module.exports = app => {
  app.post('/etupay/callback', etupay.middleware, async (req, res) => {
    let { shouldSendMail, user, error } = await handlePayload(
      req.app.locals.models,
      req.etupay
    )
    if (error) return res.status(200).end()
    if (shouldSendMail) {
      await mail('user.paid', user.email, {
        mail: user.email,
        link: `${env.WEBSITE}/dashboard/home`
      })
    }

    return res
      .status(200)
      .json({})
      .end()
  })

  app.get('/etupay/return', etupay.middleware, async (req, res, next) => {
    if (req.query.payload) {
      let {
        shouldSendMail,
        user,
        error,
        transactionState
      } = await handlePayload(req.app.locals.models, req.etupay)
      if (error) {
        if (error === 'ALREADY_PAID') return res.redirect(env.ETUPAY_SUCCESSURL)
        else return res.redirect(env.ETUPAY_ERRORURL)
      }
      if (!user) {
        return res
          .status(404)
          .json({ error: 'USER_NOT_FOUND' })
          .end()
      }
      if (shouldSendMail) {
        await mail('user.paid', user.email, {
          mail: user.email,
          link: `${env.WEBSITE}/dashboard/home`
        })
      }
      if (transactionState !== 'paid') {
        log.info(`${user.email} was redirected to ${env.ETUPAY_ERRORURL}`)
        return res.redirect(env.ETUPAY_ERRORURL)
      }
      log.info(`${user.email} was redirected to ${env.ETUPAY_SUCCESSURL}`)
      return res.redirect(env.ETUPAY_SUCCESSURL)
    }

    next()
  })
}
