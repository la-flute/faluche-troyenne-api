const pick = require('lodash.pick')

module.exports.outputFields = user =>
  pick(user, [
    'id',
    'nickName',
    'firstName'
  ])
