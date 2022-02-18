// server.js

const express = require("express");
const mysql = require("mysql");
const bodyParser = require("body-parser");
const cors = require("cors");
const app = express();
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use(cors());

// ClearDBの認証情報
const pool = mysql.createPool({
  host: 'localhost',
  user: 'root',
  password: 'mySql-888',
  database: 'analysis_db'
});

// "/history"に対してのルーティング
app.get("/history", function (req, res) {
  pool.query(
    'SELECT works_data.video_id, works_data.product_name ' +
    'FROM access_history INNER JOIN works_data ON access_history.video_id = works_data.video_id ' +
    'ORDER BY last_access_time DESC LIMIT 0, 5;',
    function (error, results) {
      if (error) throw error;
      res.send(results);
    }
  );
});

// "/results"に対してのルーティング
app.get("/results", function (req, res) {
  pool.query(
    'SELECT video_id, product_name ' +
    'FROM works_data ' +
    'ORDER BY video_id;',
    function (error, results) {
      if (error) throw error;
      res.send(results);
    }
  );
});
// "/results"に対してのルーティング
app.get("/result/:id", function (req, res) {
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
  );
});

// "/statistics"に対してのルーティング
app.get("/category", function (req, res) {
  pool.query(
    "SELECT * " +
    "FROM score_category;",
    function (error, results) {
      if (error) throw error;
      res.send(results);
    }
  );
});

// "/statistics"に対してのルーティング
app.get("/statistics", function (req, res) {
  //const category = req.params.category
  pool.query(
    "SELECT * " +
    "FROM ranking LEFT JOIN score_category ON ranking.category = score_category.category;",
    function (error, results) {
      if (error) throw error;
      console.log(results)
      res.send(results);
    }
  );
});

// "/productName"に対してのルーティング
app.get("/productName/:id", function (req, res) {
  const videoId = req.params.id
  pool.query(
    "SELECT product_name " +
    "FROM works_data " +
    "WHERE video_id = '" + videoId + "';",
    function (error, results) {
      if (error) throw error;
      res.send(results);
    }
  );
});
/*
// anotation
app.post('/annotation/', (req, res) => {
  console.log(req.body);
  res.send("Received POST Data!");
});
*/
// DBへの再接続処理
const handleDisconnect = () => {
  pool.connect((err) => {
    if (err) {
      console.log("error connecting: " + err.stack);
      return;
    }
    console.log("success");
  });
};

// DB接続のエラーハンドリング
pool.on("error", function (err) {
  console.log("db error", err);
  if (err.code === "PROTOCOL_PoocreatePool_LOST") {
    handleDisconnect();
  } else {
    throw err;
  }
});

const port = process.env.PORT || 3000;
app.listen(port, () => console.log(`Example app listening on port ${port}!`));

/*
const express = require('express')
const mysql = require('mysql')
const app = express()
const port = process.env.PORT || 4000

const connection = mysql.createPool({
  host: 'localhost',
  user: 'root',
  password: 'mySql-888',
  database: 'analysis_db'
});

app.get("/api", (req, res) => {
  connection.query(
    'SELECT * from scene_data LIMIT 0, 5;',
    function(err, results, fields) {
      if(err) {
        console.log("接続終了(異常)");
        throw err;
      }
      res.json({message: results[0].title});
    }
  );
  console.log("接続終了(正常)");
});

app.listen(port, () => {
  console.log(`listening on *:${port}`);
})
*/


/*
'SELECT works_data.video_id, works_data.product_name ' +
    'FROM access_history INNER JOIN works_data ON access_history.video_id = works_data.video_id ' +
    'ORDER BY last_access_time DESC LIMIT 0, 5;',
*/


