const errorHandler = require('../../utils/errorHandler')
const { check } = require('express-validator/check')
const validateBody = require('../../middlewares/validateBody')
const isAuth = require('../../middlewares/isAuth')
const isAdmin = require('../../middlewares/isAdmin')

/**
 * DELETE /bedrooms/:id
 *
 */
module.exports = app => {
  app.delete('/bedrooms/:id', [isAuth(), isAdmin('bedroom-delete')])
  app.delete('/bedrooms/:id', async (req, res) => {
    const { Bedroom } = req.app.locals.models

    try {
      let bedroom = await Bedroom.findById(req.params.id)
      if (!bedroom) {
        return res
          .status(404)
          .json({ error: 'BEDROOM_NOT_FOUND' })
          .end()
      }
      await bedroom.destroy()
      return res
        .status(200)
        .json('OK')
        .end()
    } catch (err) {
      errorHandler(err, res)
    }
  })
}
