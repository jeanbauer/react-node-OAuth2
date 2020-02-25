const mongoose = require('mongoose')
const Schema = mongoose.Schema

const userSchema = new Schema(
  {
    id: String,
    name: String,
    email: String,
    image: { type: String, default: '' }
  },
  { timestamps: true }
)

const User = mongoose.model('User', userSchema)

module.exports = User
