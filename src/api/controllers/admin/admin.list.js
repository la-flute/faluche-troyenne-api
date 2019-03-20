const errorHandler = require('../../utils/errorHandler')
const isAuth = require('../../middlewares/isAuth')
const isOrga = require('../../middlewares/isOrga')

/**
 * GET /admin/list
 *
 * Response:
 * [
 *    { id, name, firstname, lastname, email, paid, }, ...
 * ]
 */
module.exports = app => {
  app.get('/admin/list', [isAuth('admin-list'), isOrga('admin-list')])
  app.get('/admin/list', async (req, res) => {
    try {
      const { User, Order } = req.app.locals.models
      let users = await User.findAll({
        include: [{ model: Order, attributes: ['paid'] }],
        order: [['town', 'ASC'], ['lastName', 'ASC'], ['firstName', 'ASC']],
      })
      let usersFinal = users.map(user => {
        let paid = user.orders.find(o => o.paid)
        return {
          id: user.id,
          lastName: user.lastName,
          firstName: user.firstName,
          nickName: user.nickName,
          studies: user.studies,
          caution: user.caution,
          attestation: user.attestation,
          town: user.town,
          folklore: user.folklore,
          paid: paid ? true : false,
          trajet: user.trajet !== null,
          validated: user.validated,
        }
      })
      return res
        .status(200)
        .json(usersFinal)
        .end()
    } catch (err) {
      errorHandler(err, res)
    }
  })
}
