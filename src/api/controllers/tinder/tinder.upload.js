const errorHandler = require('../../utils/errorHandler')
const jwt = require('jsonwebtoken')
const env = require('../../../env')
const { promisify } = require('util')
jwt.verify = promisify(jwt.verify)
const log = require('../../utils/log')(module)
const multer = require('multer')
const storage = multer.diskStorage({
  destination: './images/',
  filename: async (req, file, cb) => {
    const { User } = req.app.locals.models
    const { auth } = req.body
    if (!auth || auth.length === 0) {
      log.warn('missing token')

      cb('NO_TOKEN', null)
    }

    try {
      const decoded = await jwt.verify(auth, env.API_SECRET)

      const user = await User.findById(decoded.id)
      if (!user) {
        log.warn('invalid token : user not found')
        cb('INVALID_TOKEN', null)
        return
      }
      if (!user.validated) {
        log.warn('user not validated')
        cb('NOT_VALIDE', null)
        return 
      }
      const filename = user.id + '.' + file.originalname.split('.').pop()
      user.image = filename
      await user.save()
      cb(null, filename)
    } catch (err) {
      log.warn('invalid token')

      cb('INVALID_TOKEN', null)
    }
  }
})
const upload = multer({ storage }).single('file')
/**
 * POST /tinders/image
 *
 * Body :
 *
 * { type }
 *
 */
module.exports = app => {
  app.post('/tinders/image', async (req, res) => {
    try {
      upload(req, res, async error => {
        if (error) {
          return res
            .status(400)
            .json({ error })
            .end()
        } else {
          return res.status(200).end()
        }
      })
    } catch (e) {
      errorHandler(e)
    }
  })
}
