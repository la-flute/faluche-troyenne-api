const errorHandler = require('../../utils/errorHandler')
const isAuth = require('../../middlewares/isAuth')

/**
 * POST /bedrooms/:id/join
 */
module.exports = app => {

  app.post('/bedrooms/:id/join', [isAuth('bedroom-join')])
  app.post('/bedrooms/:id/join', async (req, res) => {
    const { Bedroom, User, Order } = req.app.locals.models

    try {
      const paid = await Order
        .findOne({
          where: {
            paid: 1,
            bedroom: true,
            userId: req.user.id
          }
        })
      if(!paid) { //TODO vérifier logement en dure payé
        return res
          .status(402)
          .json({ error :'NOT_PAID' })
          .end()
      }
      let bedroom = await Bedroom.findById(req.params.id, {
        include: [User]
      })
      if (!bedroom) {
        return res
          .status(404)
          .json({ error: 'Bedroom not found' })
          .end()
      }
      if (bedroom.users.find(u => u.id === req.user.id)) {
        return res
          .status(400)
          .json({ error: 'User already in room' })
          .end()
      }
      if (bedroom.places <= bedroom.users.length) {
        return res
          .status(400)
          .json({ error: 'Bedroom full' })
          .end()
      }
      await bedroom.addUser(req.user)
      return res
        .status(200)
        .json('OK')
        .end()
    } catch (err) {
      errorHandler(err, res)
    }
  })
}