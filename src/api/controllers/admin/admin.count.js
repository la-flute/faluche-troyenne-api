const errorHandler = require('../../utils/errorHandler')
const isAuth = require('../../middlewares/isAuth')
const isOrga = require('../../middlewares/isOrga')

/**
 * GET /admin/counts
 *
 * Response:
 * {
 * "totalUsers"
    "totalPaidUsers"
    "totalValidatedUsers"
    "totalPaidUsersWithBedroom"
    "totalValidatedUsersWithBedroom"
    "totalPaidUsersWithAlcool"
    "totalPaidUsersWithoutAlcool"
 * }
 */
module.exports = app => {
  app.get('/admin/counts', [isAuth('admin-counts'), isOrga('admin-counts')])
  app.get('/admin/counts', async (req, res) => {
    try {
      const { User, Order } = req.app.locals.models
      const totalUsers = await User.count()
      const totalValidatedUsers = await User.count({ where: { validated: 1 } })
      const totalPaidUsers = await Order.count({
        where: { paid: 1 }
      })
      const totalPaidUsersWithAlcool = await Order.count({
        where: { paid: 1, alcool: 1 }
      })
      const totalPaidUsersWithBedroom = await Order.count({
        where: { paid: 1, bedroom: 1 }
      })
      let totalValidatedUsersWithBedroom = await Order.findAll({
        include: [User],
        where: { paid: 1, bedroom: 1 }
      })
      totalValidatedUsersWithBedroom = totalValidatedUsersWithBedroom.filter(
        order => order.user && order.user.validated
      ).length
      return res
        .status(200)
        .json({
          totalUsers,
          totalPaidUsers,
          totalValidatedUsers,
          totalPaidUsersWithBedroom,
          totalValidatedUsersWithBedroom,
          totalPaidUsersWithAlcool,
          totalPaidUsersWithoutAlcool: totalPaidUsers - totalPaidUsersWithAlcool
        })
        .end()
    } catch (err) {
      errorHandler(err, res)
    }
  })
}
