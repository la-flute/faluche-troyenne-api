const errorHandler = require('../../utils/errorHandler')
const fs = require('fs')
const isAuth = require('../../middlewares/isAuth')
const path = require('path')
/**
 * POST /tinders/image
 *
 * Body :
 *
 * { type }
 *
 */
module.exports = app => {
  app.delete('/tinders/image', [isAuth('tinder-image-delete')])
  app.delete('/tinders/image', async (req, res) => {
    try {
      fs.unlink(path.join(__dirname, '../../../../images', req.user.image), err => {
        if (err) throw err
      })
      req.user.image = null
      await req.user.save()
      return res.status(200).end()
    } catch (e) {
      errorHandler(e)
    }
  })
}
