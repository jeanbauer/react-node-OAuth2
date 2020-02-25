const registerRouter = app => {
  app.use('/users', require('./users'))
}

module.exports = registerRouter
