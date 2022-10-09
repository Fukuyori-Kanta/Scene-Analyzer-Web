// WEBサーバを起動
const express = require('express')
const app = express()
const port = process.env.PORT || 3001

// body-parserを有効にする
const bodyParser = require('body-parser')
const cors = require('cors')
app.use(bodyParser.urlencoded({ extended: true }))
app.use(bodyParser.json())
app.use(cors())
app.listen(port, () => console.log(`Example app listening on port ${port}!`))

const createError = require('http-errors')
const cookieParser = require('cookie-parser')
const logger = require('morgan')

app.use(logger('dev'))
app.use(express.json())
app.use(express.urlencoded({ extended: false }))
app.use(cookieParser())

// ベーシック認証の設定
app.use(require('./basicAuth'))

// passportモジュールの読み込み
var passport = require('passport')
require('./config/passport.')(app)

// セッションミドルウェアの設定
var session = require('express-session')
app.use(session({ resave: false, saveUninitialized: false, secret: 'passport auth' }))

// session用のミドルウェアを有効化
app.use(passport.initialize())
app.use(passport.session())

// APIの定義
require('./api/dbAPI')(app)   // DBアクセス用API
require('./api/authAPI')(app) // ユーザー認証用（LogIn, LogOunt）API

// 静的ファイルを自動的に返すようルーティング
app.use('/top', express.static('./public'))
app.use('/login', express.static('./public'))
//app.use('/logout', express.static('./public'))
app.use('/user', express.static('./public'))
app.use('/regist', express.static('./public'))
app.use('/results', express.static('./public'))
app.use('/result/:id', express.static('./public'))
app.use('/statistics', express.static('./public'))
app.use('/newAnalysis', express.static('./public'))
app.use('/labels', express.static('./public'))
app.use('/search/:option/:word', express.static('./public'))
app.use('/test', express.static('./public'))
app.use('/', (req, res) => {
  res.redirect(302, '/top')
})

// catch 404 and forward to error handler
app.use(function (req, res, next) {
  next(createError(404))
})

// error handler
app.use(function (err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message
  res.locals.error = req.app.get('env') === 'development' ? err : {}

  // render the error page
  res.status(err.status || 500)
  res.render('error')
})
