const basicAuth = require('basic-auth')
const createError = require('http-errors')
const allowedUsers = require('./config/basicAuthData.json') // 許可されたユーザ

// 許可したユーザを判定する
const judgeAllowedUser = (credentials) => {
  if (!credentials) {
    return false
  }
  let username = credentials.name
  let password = credentials.pass
  let valid = true

  valid = !!allowedUsers[username] && allowedUsers[username] === password && valid
  return valid
}

module.exports = (req, res, next) => {
  let credentials = basicAuth(req)
  if (judgeAllowedUser(credentials)) {
    next()
  } else {
    res.setHeader('WWW-Authenticate', 'Basic realm="tutorial"')
    next(createError(401))
  }
}