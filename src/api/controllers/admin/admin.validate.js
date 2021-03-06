const errorHandler = require('../../utils/errorHandler')
const { check } = require('express-validator/check')
const validateBody = require('../../middlewares/validateBody')
const isAuth = require('../../middlewares/isAuth')
const isTreso = require('../../middlewares/isTreso')

/**
 * POST /admin/validate
 *
 * Body :
 *
 * { userId, alcool, bedroom }
 *
 */
module.exports = app => {
  app.post('/admin/validate', [
    isAuth('admin-validate'),
    isTreso('admin-validate')
  ])
  app.post('/admin/validate', [check('userId').isUUID().exists(), validateBody()])
  app.post('/admin/validate', async (req, res) => {
    const { User } = req.app.locals.models
    try {
      const { userId } = req.body

      await User.update({ validated: 1 }, { where: {id: userId} })
      return res
        .status(200)
        .json('OK')
        .end()
    } catch (err) {
      errorHandler(err, res)
    }
  })
}
