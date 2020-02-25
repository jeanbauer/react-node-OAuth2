const router = require('express').Router()
const passport = require('passport')
const chalk = require('chalk')

router.get('/logout', (req, res) => {
  req.logout()
  res.redirect(`${process.env.HOST}`)
})

router.get('/login/success', (req, res) => {
  console.log(chalk.bgBlue('🔒 /login/success', req.user))

  if (req.user) {
    res.json({
      success: true,
      message: 'user has successfully authenticated',
      user: req.user
    })
  }

  res.json({
    success: false,
    message: 'user is not authenticated'
  })
})

// when login failed, send failed msg
router.get('/login/failed', (req, res) => {
  res.status(401).json({
    success: false,
    message: 'user failed to authenticate.'
  })
})

router.get('/logout', (req, res) => {
  req.logout()
  res.redirect(`${process.env.HOST}`)
})

router.get(
  '/google',
  passport.authenticate('google', {
    scope: ['profile', 'email']
  })
)

router.get(
  '/google/callback',
  passport.authenticate('google', {
    successRedirect: `${process.env.HOST}`,
    failureRedirect: '/auth/login/failed'
  })
)

module.exports = router
