/**
 * GET /user/list
 *
 * Response:
 * [
 *    { id, name, firstname, lastname, email, paid, }, ...
 * ]
 */
module.exports = app => {
  app.get('/user/list', async (req, res) => {
    try {
      const { User } = req.app.locals.models

      const users = await User.findAll({
        order: [['town', 'ASC']]
      })
      return res
        .status(200)
        .json(users)
        .end()
    } catch (err) {
      errorHandler(err, res)
    }
  })
}
