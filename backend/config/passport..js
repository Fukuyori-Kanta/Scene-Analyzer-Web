var passport = require('passport')

module.exports = () => {
  // sessionにユーザー(のキー)情報を格納する処理
  passport.serializeUser(function (user, done) {
    done(null, user)
  })

  // sessionからユーザー情報を復元する処理
  passport.deserializeUser(function (user, done) {
    done(null, user)
  })

  // 利用するstrategyを設定
  passport.use(require('./passport/local'));
}