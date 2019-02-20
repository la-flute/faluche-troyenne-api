const errorHandler = require('../../utils/errorHandler')
const isAuth = require('../../middlewares/isAuth')
const isAdmin = require('../../middlewares/isAdmin')

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

  app.get('/bedrooms', [isAuth(), isAdmin()])
  app.get('/bedrooms', async (req, res) => {
    const { Bedroom, User } = req.app.locals.models

    try {
      let bedrooms = await Bedroom.findAll({
        attributes: ['id', 'number', 'places', 'floor'],
        include: [{
          model: User,
          attributes: ['id']
        }]
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