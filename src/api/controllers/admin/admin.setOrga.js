const log = require('../../utils/log')(module)
const errorHandler = require('../../utils/errorHandler')
const isAuth = require('../../middlewares/isAuth')
const isAdmin = require('../../middlewares/isAdmin')

/**
 * POST /admin/setAdmin
 *
 * Response: none
 */

module.exports = app => {
  app.put('/admin/setOrga/:id', [isAuth(), isAdmin()])
  app.put('/admin/setOrga/:id', async (req, res) => {
    const { Permission } = req.app.locals.models
    try {
      if (req.body.orga === null) {
        return res
          .status(400) // Bad request
          .json({ error: 'BAD_REQUEST' })
          .end()
      } else if (req.params.id === req.user.id) {
        return res
          .status(403) // Forbidden
          .json({ error: 'NOT_ALLOWED' })
          .end()
      }

      let permission = await Permission.find({
        where: { userId: req.params.id }
      })
      if (permission) {
        console.log(req.body.orga)
        permission.bureau = req.body.orga
        await permission.save()
      } else {
        permission = await Permission.create({
          userId: req.params.id,
          bureau: req.body.orga
        })
      }

      if (!permission.bureau || permission.bureau === 0) {
        permission.destroy()
      }

      return res.status(200).end()
    } catch (err) {
      errorHandler(err, res)
    }
  })
}
