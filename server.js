// server.js

// WEBサーバを起動
const express = require("express")
const app = express()
const port = process.env.PORT || 3001
// body-parserを有効にする
const bodyParser = require("body-parser");
const cors = require("cors")
app.use(bodyParser.urlencoded({ extended: true }))
app.use(bodyParser.json())
app.use(cors())
app.listen(port, () => console.log(`Example app listening on port ${port}!`))

// DBへの接続・認証
const mysql = require("mysql")
const pool = mysql.createPool({
  host: 'localhost',
  user: 'root',
  password: 'mySql-888',
  database: 'analysis_db'
})

// DBへの再接続処理
const handleDisconnect = () => {
  pool.connect((err) => {
    if (err) {
      console.log("error connecting: " + err.stack);
      return
    }
    console.log("success")
  })
}

// DB接続のエラーハンドリング
pool.on("error", function (err) {
  console.log("db error", err)
  if (err.code === "PROTOCOL_PoocreatePool_LOST") {
    handleDisconnect()
  } else {
    throw err
  }
})

// APIの定義
// 閲覧履歴（直近５件）を返すAPI
app.get("/api/history", function (req, res) {
  pool.query(
    'SELECT works_data.video_id, works_data.product_name ' +
    'FROM access_history INNER JOIN works_data ON access_history.video_id = works_data.video_id ' +
    'ORDER BY last_access_time DESC LIMIT 0, 5;',
    function (error, results) {
      if (error) throw error
      res.send(results)
    }
  )
})

// 結果一覧（動画ID, 作品名）を返すAPI
app.get("/api/results", function (req, res) {
  pool.query(
    'SELECT video_id, product_name ' +
    'FROM works_data ' +
    'ORDER BY video_id;',
    function (error, results) {
      if (error) throw error
      res.send(results)
    }
  )
})

// 該当動画IDの分析結果を返すAPI
app.get("/api/result/:id", function (req, res) {
  const videoId = req.params.id
  pool.query(
    "SELECT * " +
    "FROM scene_data " +
    "LEFT JOIN works_data ON scene_data.video_id = works_data.video_id  " +
    "LEFT JOIN scene_label ON scene_label.scene_label_id = scene_data.scene_label_id " +
    "LEFT JOIN label_list ON scene_label.label_id = label_list.label_id " +
    "LEFT JOIN scene_favo ON scene_favo.scene_favo_id = scene_data.scene_favo_id " +
    "LEFT JOIN score_category ON scene_favo.category = score_category.category " +
    "WHERE scene_data.video_id='" + videoId + "' AND score_category.category = 'F';",
    function (error, results) {
      if (error) throw error
      console.log(results)
      res.send(results)
    }
  )
})

// 好感度カテゴリを返すAPI
app.get("/api/category", function (req, res) {
  pool.query(
    "SELECT * " +
    "FROM score_category;",
    function (error, results) {
      if (error) throw error
      res.send(results)
    }
  )
})

// 統計結果を返すAPI
app.get("/api/statistics", function (req, res) {
  //const category = req.params.category
  pool.query(
    "SELECT * " +
    "FROM ranking LEFT JOIN score_category ON ranking.category = score_category.category;",
    function (error, results) {
      if (error) throw error
      console.log(results)
      res.send(results)
    }
  )
})

// 該当動画IDの作品名を返すAPI
app.get("/api/productName/:id", function (req, res) {
  const videoId = req.params.id
  pool.query(
    "SELECT product_name " +
    "FROM works_data " +
    "WHERE video_id = '" + videoId + "';",
    function (error, results) {
      if (error) throw error
      res.send(results)
    }
  )
})
/*
// anotation
app.post('/annotation/', (req, res) => {
  console.log(req.body)
  res.send("Received POST Data!")
})
*/

// 静的ファイルを自動的に返すようルーティング
app.use('/top', express.static('./public'))
app.use('/results', express.static('./public'))
app.use('/result/:id', express.static('./public'))
app.use('/statistics', express.static('./public'))
app.use('/newAnalysis', express.static('./public'))
app.use('/test', express.static('./public'))
app.use('/', (req, res) => {
  res.redirect(302, '/top')
})