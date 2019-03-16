const errorHandler = require('../../utils/errorHandler')
const isAuth = require('../../middlewares/isAuth')

/**
 * GET /bedrooms
 *
 * Response:
 * [
 *    {
 *      id,
 *      number,
 *      places,
 *      floor,
 *      users: [id1, id2, ...]
 *    },...
 * ]
 */
module.exports = app => {
  app.get('/bedrooms', [isAuth()])
  app.get('/bedrooms', async (req, res) => {
    const { Bedroom, User } = req.app.locals.models

    try {
      let bedrooms = await Bedroom.findAll({
        attributes: ['id', 'number', 'places', 'floor'],
        include: [
          {
            model: User,
            attributes: ['id', 'nickName', 'firstName', 'lastName', 'town', 'studies']
          }
        ]
      })
      bedrooms = bedrooms.map(bedroom => {
        bedroom.users = bedroom.users.map(user => {
          user.lastName = user.lastName[0].toUpperCase()
          return user
        })
        return bedroom
      })
      return res
        .status(200)
        .json(bedrooms)
        .end()
    } catch (err) {
      errorHandler(err, res)
    }
  })
}
