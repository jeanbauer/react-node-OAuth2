const express = require('express')
const router = express.Router()
const Users = require('../models/users.js')

const getUserById = async (req, res) => {
  try {
    const user = await Users.findById(req.params._id)

    res.send({ user, message: 'success' })
  } catch (err) {
    console.log('getUserById err', err)
    res.status(400).send({ message: 'error fetching user' })
  }
}

const deleteUser = async (req, res) => {
  try {
    const user = await Users.deleteOne({
      _id: req.params.id
    })

    res.send({ user, message: 'success' })
  } catch (err) {
    console.log('deleteUser err', err)
    res.status(400).send({ message: 'error deleting user' })
  }
}

router.delete('/:id', deleteUser)
router.get('/:id', getUserById)

module.exports = router
