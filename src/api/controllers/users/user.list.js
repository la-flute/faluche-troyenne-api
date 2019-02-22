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
      console.log('TON PADRE')
      const users = await User.findAll({
        order: [['town', 'ASC']]
      })

      let usersFinal = users.map(user =>{
        return{
          name: `${user.firstName}.${user.lastName.charAt(0).toUpperCase()} ${user.nickName ? user.nickName : '' }`,
          town: user.town
        }
      })
      console.log('TON PERE', usersFinal)
      return res
        .status(200)
        .json(usersFinal)
        .end()
    } catch (err) {
      errorHandler(err, res)
    }
  })
}
