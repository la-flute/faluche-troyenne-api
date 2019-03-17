const errorHandler = require('../../utils/errorHandler')
const isAuth = require('../../middlewares/isAuth')
const isWrite = require('../../middlewares/isWrite')

/**
 * GET /displays
 *
 * Body :
 *
 * { userId, alcool, bedroom }
 *
 */
module.exports = app => {
  app.get('/displays', [isAuth('displays'), isWrite('displays')])
  app.get('/displays', async (req, res) => {
    const { Display } = req.app.locals.models
    try {
      let displays = await Display.findAll({
        attributes: ['name', 'code', 'render'],
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
