const passport = require('passport')
const GoogleStrategy = require('passport-google-oauth20').Strategy
const User = require('../models/users')

// serialize the user.id to save in the cookie session
// so the browser will remember the user when login
passport.serializeUser((user, done) => {
  console.log('\n\n  🦑 🦑 🦑 serializeUser id', user, '\n\n')

  done(null, user.id)
})

// deserialize the cookieUserId to user in the database
passport.deserializeUser((id, done) => {
  console.log('\n\n  ⚠️ ⚠️ ⚠️ deserializeUser id', id, '\n\n')

  User.findOne({ id })
    .then(user => {
      done(null, user)
    })
    .catch(e => {
      done(new Error('Failed to deserialize an user'))
    })
})

passport.use(
  new GoogleStrategy(
    {
      clientID: process.env.GOOGLE_AUTH0_CLIENT_ID,
      clientSecret: process.env.GOOGLE_AUTH0_CLIENT_SECRET,
      callbackURL: `/auth/google/callback`
    },
    async (token, refreshToken, profile, done) => {
      const currentUser = await User.findOne({
        id: profile.id
      })

      if (!currentUser) {
        try {
          const newUser = await new User({
            id: profile.id,
            name: profile.displayName,
            image: profile.photos[0].value,
            email: profile.emails[0].value
          }).save()

          if (newUser) {
            done(null, newUser)
          }
        } catch (err) {
          console.log('Erro saving user:', err)
        }
      }

      done(null, currentUser)
    }
  )
)
