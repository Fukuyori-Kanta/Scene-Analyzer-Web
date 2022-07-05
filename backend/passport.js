var passport = require('passport')
var LocalStrategy = require('passport-local').Strategy
var session = require('express-session')

// セッションミドルウェア設定
app.use(session({ resave: false, saveUninitialized: false, secret: 'passport test' })); // 追記

app.use(passport.initialize());
app.use(passport.session()); // 追記
var LocalStrategy = require('passport-local').Strategy;

passport.use(new LocalStrategy({
  usernameField: 'username',
  passwordField: 'password',
  passReqToCallback: true,
  session: false,
}, function (req, username, password, done) {
  pool.query("select * from user_info;", function(err, users) {
    // usernameもpasswordもユニーク前提
    var usernames = [];
    var passwords = [];
    for (i = 0; i < users.length; i++) {
      usernames.push(users[i].user_name);
      // input(type="password")で渡される値はstringのようなので、
      // データベースから取り出した値もstringにしています。
      var pw = users[i].password.toString();
      passwords.push(pw);
    }
    if (usernames.includes(username) && passwords.includes(password)) {
      console.log('ok');
      return done(null, username);
    }
    console.log("ng");
    return done(null, false, {message: "invalid"});
  });

}));

passport.serializeUser(function (user, done) {
  done(null, user);
});

passport.deserializeUser(function (user, done) {
  done(null, user);
});

module.exports = passport