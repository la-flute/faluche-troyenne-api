const errorHandler = require('../../utils/errorHandler')
const isAuth = require('../../middlewares/isAuth')
const path = require('path')

/**
 * GET /tinders/:id/image
 *
 * Body :
 *
 * { type }
 *
 * Response: 'MATCH'
 */
module.exports = app => {
  //app.get('/tinders/:id/image', [isAuth('tinder-download')])
  app.get('/tinders/:id/image', async (req, res) => {
    const { User } = req.app.locals.models
    try {
      let user = await User.findById(req.params.id)
      if (!user)
        return res
          .status(404)
          .json({ error: 'NOT_FOUND' })
          .end()
      if (!user.image)
        return res
          .status(404)
          .json({ error: 'NO_IMAGE' })
          .end()
      res.sendFile(path.join(__dirname, '../../../../images', user.image))
    } catch (err) {
      errorHandler(err, res)
    }
  })
}
