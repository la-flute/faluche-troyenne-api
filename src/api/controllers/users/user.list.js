const log = require('../../utils/log')(module)
const errorHandler = require('../../utils/errorHandler')

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

      let usersFinal = users.map(user =>{
        return{
          lastName: user.lastName.charAt(0).toUpperCase(),
          firstName: user.firstName,
          nickName: user.nickName,
          studies: user.studies,
          town: user.town,
          folklore: user.folklore
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
