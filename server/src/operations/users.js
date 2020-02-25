const Users = require('../models/users')

const getUser = async _id => {
  const user = await Users.findById(_id)
  return user
}

module.exports = {
  getUser
}
