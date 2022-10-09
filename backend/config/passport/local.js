var pool = require('../../dbConnection')  // コネクションプール

// Strategyの読み込み
var LocalStrategy = require('passport-local').Strategy;

// Strategyの認証ロジックを追加
module.exports = new LocalStrategy({
  usernameField: 'username',
  passwordField: 'password',
  passReqToCallback: true,
  session: false,
}, function (req, username, password, done) {
  pool.query("select * from user_info;", function (err, users) {
    // usernameもpasswordもユニーク前提
    var usernames = []
    var passwords = []
    for (i = 0; i < users.length; i++) {
      usernames.push(users[i].user_name)
      var pw = users[i].password.toString()
      passwords.push(pw)
    }
    if (usernames.includes(username) && passwords.includes(password)) {
      console.log('success')
      return done(null, username)
    }
    console.log("invalid")
    return done(null, false, { message: "invalid" })
  })
})
