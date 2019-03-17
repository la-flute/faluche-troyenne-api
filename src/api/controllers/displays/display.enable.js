const errorHandler = require('../../utils/errorHandler')
const isAuth = require('../../middlewares/isAuth')
const isWrite = require('../../middlewares/isWrite')

/**
 * POST /displays/:code/enable
 *
 * Body :
 *
 * { }
 *
 */
module.exports = app => {
  app.post('/displays/:code/enable', [
    isAuth('displays-enable'),
    isWrite('displays-enable'),
  ])
  app.post('/displays/:code/enable', async (req, res) => {
    const { Display } = req.app.locals.models
    try {
      let enable = await Display.findOne({
        attributes: ['id', 'name', 'code', 'render'],
        where: {
          code: req.params.code,
        },
      })
      enable.render = true
      enable.save()
      return res.status(200).end()
    } catch (err) {
      errorHandler(err, res)
    }
  })
}
