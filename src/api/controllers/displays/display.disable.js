const errorHandler = require('../../utils/errorHandler')
const isAuth = require('../../middlewares/isAuth')
const isWrite = require('../../middlewares/isWrite')

/**
 * PUT /displays/:code/disable
 *
 * Body :
 *
 * { }
 *
 */
module.exports = app => {
  app.post('/displays/:code/disable', [
    isAuth('displays-disable'),
    isWrite('displays-disable'),
  ])
  app.post('/displays/:code/disable', async (req, res) => {
    const { Display } = req.app.locals.models
    try {
      let disable = await Display.findOne({
        attributes: ['id', 'name', 'code', 'render'],
        where: {
          code: req.params.code,
        },
      })
      disable.render = false
      disable.save()
      return res
        .status(200)
        .json(disable)
        .end()
    } catch (err) {
      errorHandler(err, res)
    }
  })
}
