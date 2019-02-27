const log = require('../../utils/log')(module)
const errorHandler = require('../../utils/errorHandler')
const isAuth = require('../../middlewares/isAuth')
const isAdmin = require('../../middlewares/isAdmin')

/**
 * GET /admin/list
 *
 * Response:
 * [
 *    { id, name, firstname, lastname, email, paid, }, ...
 * ]
 */
module.exports = app => {
<<<<<<< HEAD
  app.get('/admin/list', async (req, res) => {
    try {
      const { User, Order } = req.app.locals.models
      const users = await User.findAll({
        // attributes: ['id', 'lastName', 'firstName', 'nickName', 'town'],
        include: [{ model: Order, attributes: ['paid'] }],
        order: [['town', 'ASC']]
      })

      let usersFinal = users.map(user => {
=======
  app.get('/admin/list', [isAuth('admin-list'), isAdmin('admin-list')])
  app.get('/admin/list', async (req, res) => {
    try {
      const { User, Order } = req.app.locals.models
      let users = await User.findAll({
        include: [{ model: Order, attributes: ['paid'] }],
        order: [['town', 'ASC'], ['lastName', 'ASC'], ['firstName', 'ASC']]
      })
      let usersFinal = users.map(user => {
        let paid = user.orders.find(o => o.paid)
>>>>>>> ebfca66d300f42165647ff21a9cbbb6772e3fbc8
        return {
          lastName: user.lastName.charAt(0).toUpperCase(),
          firstName: user.firstName,
          nickName: user.nickName,
          studies: user.studies,
          caution: user.caution,
          attestation: user.attestation,
          town: user.town,
          folklore: user.folklore,
          paid: paid ? true : false,
          validated: user.validated
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