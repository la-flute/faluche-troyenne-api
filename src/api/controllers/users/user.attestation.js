const { check } = require('express-validator/check')
const validateBody = require('../../middlewares/validateBody')
const isAuth = require('../../middlewares/isAuth')
const errorHandler = require('../../utils/errorHandler')
const log = require('../../utils/log')(module)
const pick = require('lodash.pick')

/**
 * POST /user/attestation
 */
module.exports = app => {
  app.post('/user/attestation', [isAuth('user-edit')])


  app.post('/user/attestation', async (req, res) => {
    try {
      if (req.user.attestation) {
        res
          .status(400)
          .json({ error: 'ALREADY_SUBMITTED' })
          .end()
      }
      await req.user.update({ attestation: true })

      log.info(`user ${req.user.email} sent is attestation`)

      res
        .status(200)
        .json("OK")
        .end()
    } catch (err) {
      errorHandler(err, res)
    }
  })
}
