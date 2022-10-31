var passport = require('passport')
var pool = require('../dbConnection') // コネクションプール

module.exports = (app) => {

  // ユーザー名が登録済みであるかチェックするAPI
  app.get('/api/checkRegistered/:userName', (req, res) => {
    const userName = req.params.userName  // ユーザー名
    pool.query(
      "SELECT * " +
      "FROM user_info " +
      "WHERE user_name = '" + userName + "';",
      (error, results) => {
        if (error) throw error
        res.send(results)
      }
    )
  })

  // ユーザー情報を登録するAPI
  app.post("/api/registUser", (req, res) => {
    // 登録情報
    const formData = [[
      req.body.username,
      req.body.password,
      req.body.creation_date
    ]]
    pool.query(
      "INSERT INTO user_info (user_name, password, creation_date) " +
      "VALUES ?", [formData],
      (error, results) => {
        if (error) throw error
        res.send(JSON.stringify({ "status": 200, "error": null, "response": results }))
      }
    )
  })

  // ログインフォームから送信された情報が正しいかチェックするAPI
  app.post('/api/login', passport.authenticate('local'), (req, res) => {
    // 認証チェック
    if (req.isAuthenticated()) {
      // 正しい場合は成功レスポンスを返す
      res.sendStatus(200)
    }
  })

  // ログイン中のユーザーからログアウトするAPI
  app.post("/api/logout", (req, res) => {
    const userBeforeDeletion = req.session.passport.user   // 削除前のユーザー

    // ログイン中のユーザー情報をセッションから削除
    delete req.session.passport.user

    const userAfterDeletion = req.session.passport.user   // 削除後のユーザー

    // ログアウト出来た場合
    if (typeof req.session.passport.user === "undefined" && userBeforeDeletion != userAfterDeletion) {
      // 成功レスポンスを返す
      res.sendStatus(200)
    }
    else {
      res.sendStatus(500)
    }
  })
}