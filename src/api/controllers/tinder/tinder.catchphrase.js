const errorHandler = require('../../utils/errorHandler')
const { check } = require('express-validator/check')
const validateBody = require('../../middlewares/validateBody')
const isAuth = require('../../middlewares/isAuth')

/**
 * POST /tinders/catchphrase
 *
 * Body :
 *
 * { catchphrase }
 *
 * Response: 'OK'
 */
module.exports = app => {
  app.post('/tinders/catchphrase', [isAuth('tinder-catchphrase')])
  app.post('/tinders/catchphrase', [
    check('catchphrase').exists(),
    validateBody()
  ])
  app.post('/tinders/catchphrase', async (req, res) => {
    try {
      req.user.catchphrase = req.body.catchphrase
      await req.user.save()
      return res.status(200).end()
    } catch (err) {
      errorHandler(err, res)
    }
  })
}
