const errorHandler = require('../../utils/errorHandler')
const { check } = require('express-validator/check')
const validateBody = require('../../middlewares/validateBody')
const isAuth = require('../../middlewares/isAuth')
const isTreso = require('../../middlewares/isTreso')

/**
 * POST /admin/unvalidate
 *
 * Body :
 *
 * { userId, alcool, bedroom }
 *
 */
module.exports = app => {
  app.post('/admin/unvalidate', [
    isAuth('admin-unvalidate'),
    isTreso('admin-unvalidate')
  ])
  app.post('/admin/unvalidate', [check('userId').isUUID().exists(), validateBody()])
  app.post('/admin/unvalidate', async (req, res) => {
    const { User } = req.app.locals.models
    try {
      const { userId } = req.body

      await User.update({ validated: 0 }, { where: {id: userId} })
      return res
        .status(200)
        .json('OK')
        .end()
    } catch (err) {
      errorHandler(err, res)
    }
  })
}
