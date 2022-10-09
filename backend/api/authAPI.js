var passport = require('passport')

module.exports = (app) => {

  // ログインフォームから送信された情報が正しいかチェックするAPI
  app.post('/api/login', passport.authenticate('local'),
    function (req, res) {
      // 認証チェック
      if (req.isAuthenticated()) {
        // 正しい場合は成功レスポンスを返す
        res.send(200)
      }
    }
  )

  // ユーザー名が登録済みであるかチェックするAPI
  app.get('/api/checkRegistered:user_name', function (req, res) {
    const userName = req.params.user_name
    pool.query(
      "SELECT * " +
      "FROM user_info " +
      "WHERE user_name = '" + userName + "';",
      function (error, results) {
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
      function (error, results) {
        if (error) throw error
        res.send(JSON.stringify({ "status": 200, "error": null, "response": results }))
      }
    )
  })

  // ログイン中のユーザーからログアウトするAPI
  app.get("/api/logout", function (req, res, next) {
    console.log(req.session.passport.user);
    delete req.session.passport.user;
    console.log(req.session.passport.user);
    return res.redirect("/");
  });


  // app.post('/api/logout', (req, res) => {
  //   console.log("asd");
  //   console.log(req.session.passport.user);
  //   req.session.passport.user = undefined;
  //   delete req.session.user;
  //   console.log(req.session.passport.user);
  //   res.redirect('/');
  // });
}