const errorHandler = require('../../utils/errorHandler')
const { check } = require('express-validator/check')
const validateBody = require('../../middlewares/validateBody')
const isAuth = require('../../middlewares/isAuth')
const isWrite = require('../../middlewares/isWrite')

/**
 * POST /displays
 *
 * Body :
 *
 * { userId, alcool, bedroom }
 *
 */
module.exports = app => {
  app.get('/displays', [
    isAuth('displays'),
    isWrite('displays')
  ])
  app.post('/displays', async (req, res) => {
    const { Display } = req.app.locals.models
    try {
      let displays = await Bedroom.findAll({
        attributes: ['name', 'display'],
      })
      return res
        .status(200)
        .json(displays)
        .end()
    } catch (err) {
      errorHandler(err, res)
    }
  })
}
