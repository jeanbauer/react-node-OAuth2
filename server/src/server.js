/* eslint-disable no-undef */
require('dotenv').config()

const port = 8080

const express = require('express')
const helmet = require('helmet')
const morgan = require('morgan')
const bodyParser = require('body-parser')
const cors = require('cors')
const cookieParser = require('cookie-parser')

const mongoose = require('mongoose')
const passport = require('passport')
const passportSetup = require('./services/passport')

const authRoutes = require('./routes/auth-routes')
const cookieSession = require('cookie-session')
const chalk = require('chalk')
const app = express()

const registerRoutes = require('./routes')

mongoose.connect(
  process.env.MONGODB_URI,
  {
    useNewUrlParser: true,
    dbName: '',
    useFindAndModify: false
  },
  () => {
    console.log(chalk.bgBlue('connected to mongo db'))
  }
)

app.use(
  cookieSession({
    name: 'session',
    keys: ['here you would add some kind of secret'],
    maxAge: 24 * 60 * 60 * 100
  })
)

app.use(helmet())
app.use(morgan('combined'))

app.use(
  cors({
    origin: process.env.HOST, // allow to server to accept request from different origin
    methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',
    credentials: true // allow session cookie from browser to pass through
  })
)

app.use(bodyParser.json())

app.use(cookieParser('here you would add some kind of secret'))

app.use(passport.initialize())
app.use(passport.session())

// set up routes
app.use('/auth', authRoutes)

const authCheck = (req, res, next) => {
  if (!req.user) {
    res.status(401).json({
      authenticated: false,
      message: 'user has not been authenticated'
    })
  } else {
    next()
  }
}

// if it's already login, send the profile response,
// otherwise, send a 401 response that the user is not authenticated
// authCheck before navigating to home page
app.get('/', authCheck, (req, res) => {
  res.status(200).json({
    authenticated: true,
    message: 'user successfully authenticated',
    user: req.user,
    cookies: req.cookies
  })
})

// initialize the routes
registerRoutes(app)

app.listen(process.env.PORT || port, () => {
  console.log(`🔥   listening on port ${port}     🔥`)
})
