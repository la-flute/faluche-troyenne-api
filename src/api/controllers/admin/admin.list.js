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

  app.get('/admin/list', async (req, res) => {
    try {
      const { User, Order } = req.app.locals.models
      const users = await User.findAll({
        // attributes: ['id', 'lastName', 'firstName', 'nickName', 'town'],
        include: [{model: Order, attributes:['paid']}],
        order: [['town', 'ASC']]
      })

      let usersFinal = users.map(user =>{
        return{
          lastName: user.lastName.charAt(0).toUpperCase(),
          firstName: user.firstName,
          nickName: user.nickName,
          studies: user.studies,
          town: user.town,
          folklore: user.folklore,
          orders: user.orders
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
