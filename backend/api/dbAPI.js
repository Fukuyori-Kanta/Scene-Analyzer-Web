var pool = require('../dbConnection')  // コネクションプール

module.exports = (app) => {
  // 閲覧履歴（直近５件）を返すAPI
  app.get("/api/history", function (req, res) {
    pool.query(
      "SELECT works_data.video_id, works_data.product_name " +
      "FROM access_history INNER JOIN works_data ON access_history.video_id = works_data.video_id " +
      "ORDER BY last_access_time DESC LIMIT 0, 5",
      function (error, results) {
        if (error) throw error
        res.send(results)
      }
    )
  })

  // 閲覧履歴を更新するAPI
  app.get("/api/updateAccessHistory/:id", function (req, res) {
    const videoId = req.params.id
    
    pool.query(
      "UPDATE access_history set last_access_time = NOW() " +
      "WHERE video_id='" + videoId + "'",
      function (error, results) {
        if (error) throw error
        res.send(results)
      }
    )
  })

  // 結果一覧（動画ID, 作品名）を返すAPI
  app.get("/api/results", function (req, res) {
    pool.query(
      "SELECT video_id, product_name " +
      "FROM works_data " +
      "ORDER BY video_id",
      function (error, results) {
        if (error) throw error
        res.send(results)
      }
    )
  })

  // 動画名での検索結果一覧を返すAPI
  app.get("/api/results/video-name/:words", function (req, res) {
    const words = req.params.words

    pool.query(
      "SELECT works_data.video_id, works_data.product_name " +
      "FROM scene_data INNER JOIN works_data ON scene_data.video_id = works_data.video_id " +
      "WHERE product_name like '%" + words + "%' " +
      "GROUP BY works_data.video_id ",
      function (error, results) {
        if (error) throw error
        res.send(results)
      }
    )
  })

  // ラベル名での検索結果を返すAPI
  app.get("/api/results/label-name/:words", function (req, res) {
    const searchWord = req.params.words
    const words = searchWord.replace(/(\s|&nbsp)+/g, " ").split(' ')   // 検索ワード
    let query = ''  // 実行クエリ

    let qry1 = "SELECT works_data.video_id, works_data.product_name " +
      "FROM scene_data INNER JOIN works_data ON scene_data.video_id = works_data.video_id " +
      "WHERE scene_data.scene_label_id IN ( " +
      "SELECT scene_label.scene_label_id " +
      "FROM scene_label INNER JOIN label_list ON scene_label.label_id = label_list.label_id " +
      "WHERE scene_label.scene_label_id in ( " +
      "SELECT DISTINCT(scene_label_id) FROM scene_label " +
      "WHERE label_name_ja = '" + words[0] + "')) " +
      "GROUP BY works_data.video_id, works_data.product_name "

    let qry2 = "SELECT works_data.video_id, works_data.product_name  " +
      "FROM scene_data INNER JOIN works_data ON scene_data.video_id = works_data.video_id " +
      "WHERE scene_data.scene_label_id IN ( " +
      "SELECT scene_label.scene_label_id " +
      "FROM scene_label INNER JOIN label_list ON scene_label.label_id = label_list.label_id " +
      "WHERE scene_label.scene_label_id in ( " +
      "SELECT t1.scene_label_id FROM " +
      "(SELECT DISTINCT(scene_label_id) FROM scene_label INNER JOIN label_list ON scene_label.label_id = label_list.label_id " +
      "WHERE label_list.label_name_ja = '" + words[0] + "') As t1, " +
      "(SELECT DISTINCT(scene_label_id) FROM scene_label INNER JOIN label_list ON scene_label.label_id = label_list.label_id " +
      "WHERE label_list.label_name_ja = '" + words[1] + "') As t2 " +
      "WHERE t1.scene_label_id = t2.scene_label_id )) " +
      "GROUP BY works_data.video_id, works_data.product_name "

    let qry3 = "SELECT works_data.video_id, works_data.product_name " +
      "FROM scene_data INNER JOIN works_data ON scene_data.video_id = works_data.video_id " +
      "WHERE scene_data.scene_label_id IN ( " +
      "SELECT scene_label.scene_label_id " +
      "FROM scene_label INNER JOIN label_list ON scene_label.label_id = label_list.label_id " +
      "WHERE scene_label.scene_label_id in ( " +
      "SELECT t1.scene_label_id FROM " +
      "(SELECT DISTINCT(scene_label_id) FROM scene_label INNER JOIN label_list ON scene_label.label_id = label_list.label_id " +
      "WHERE label_list.label_name_ja = '" + words[0] + "') As t1, " +
      "(SELECT DISTINCT(scene_label_id) FROM scene_label INNER JOIN label_list ON scene_label.label_id = label_list.label_id " +
      "WHERE label_list.label_name_ja = '" + words[1] + "') As t2,  " +
      "(SELECT DISTINCT(scene_label_id) FROM scene_label INNER JOIN label_list ON scene_label.label_id = label_list.label_id " +
      "WHERE label_list.label_name_ja = '" + words[2] + "') As t3 " +
      "WHERE t1.scene_label_id = t2.scene_label_id AND t2.scene_label_id = t3.scene_label_id)) " +
      "GROUP BY works_data.video_id, works_data.product_name "

    // 単語数による判定
    switch (words.length) {
      case 1:
        query = qry1
        break
      case 2:
        query = qry2
        break
      case 3:
        query = qry3
        break
      default:
        query = "SELECT video_id, product_name " +
          "FROM works_data " +
          "ORDER BY video_id"
    }
    console.log(query)
    pool.query(query,
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
      "WHERE scene_data.video_id='" + videoId + "' AND score_category.category = 'F'",
      function (error, results) {
        if (error) throw error
        // console.log(results)
        res.send(results)
      }
    )
  })

  // 該当動画IDのラベル結果を返すAPI
  app.get("/api/resultLabels/:id", function (req, res) {
    const videoId = req.params.id
    pool.query(
      "SELECT * " +
      "FROM scene_data " +
      "LEFT JOIN scene_label ON scene_label.scene_label_id = scene_data.scene_label_id " +
      "LEFT JOIN label_list ON scene_label.label_id = label_list.label_id " +
      "WHERE scene_data.video_id='" + videoId + "' " +
      "AND label_list.is_cm_specialization = true",
      function (error, results) {
        if (error) throw error
        // console.log(results)
        res.send(results)
      }
    )
  })

  // 該当動画IDの好感度の結果を返すAPI
  app.get("/api/resultFavo/:id", function (req, res) {
    const videoId = req.params.id
    pool.query(
      "SELECT scene_favo.favo, scene_data.frame_num " +
      "FROM scene_favo " +
      "LEFT JOIN scene_data ON scene_favo.scene_favo_id = scene_data.scene_favo_id " +
      "LEFT JOIN score_category ON scene_favo.category = score_category.category " +
      "WHERE scene_data.video_id='" + videoId + "' AND score_category.category = 'F'",
      function (error, results) {
        if (error) throw error
        // console.log(results)
        res.send(results)
      }
    )
  })

  // 好感度カテゴリを返すAPI
  app.get("/api/category", function (req, res) {
    pool.query(
      "SELECT * " +
      "FROM score_category",
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
      "FROM ranking LEFT JOIN score_category ON ranking.category = score_category.category",
      function (error, results) {
        if (error) throw error
        // console.log(results)
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
      "WHERE video_id = '" + videoId + "'",
      function (error, results) {
        if (error) throw error
        res.send(results)
      }
    )
  })

  // 入力ラベルと同じラベル一覧情報を返すAPI
  app.get("/api/isAddable/:label", function (req, res) {
    const labelName = req.params.label // ラベル名
    pool.query(
      "SELECT * " +
      "FROM label_list " +
      "WHERE label_name_ja = '" + labelName + "' " +
      "AND is_cm_specialization = true",
      function (error, results) {
        if (error) throw error
        res.send(results)
      }
    )
  })

  // CM特化ラベル一覧を返すAPI
  app.get("/api/CM_Label", function (req, res) {
    pool.query(
      "SELECT * " +
      "FROM label_list " +
      "WHERE is_cm_specialization = true",
      function (error, results) {
        if (error) throw error
        res.send(results)
      }
    )
  })

  // アノテーション結果を保存するAPI
  app.post("/api/storeDB", (req, res) => {
    const labelsData = req.body["data"]
    const data = labelsData.map(item => {
      return [
        item.user,
        item.timestamp,
        item.operation,
        item.video_id,
        item.scene_no,
        item.label_id,
        item.x_axis,
        item.y_axis,
        item.width,
        item.height
      ]
    })
    pool.query(
      "INSERT INTO annotation_result (user_id, timestamp, operation, video_id, scene_no, label_id, x_axis, y_axis, width, height)" +
      "VALUES ?", [data],
      function (error, results) {
        if (error) throw error
        res.send(JSON.stringify({ "status": 200, "error": null, "response": results }))
      }
    )
  })

  // ラベルチェック結果を保存するAPI
  app.post("/api/postLabelsChecked", (req, res) => {
    const labelsCheckedData = req.body["data"]
    const data = labelsCheckedData.map(item => {
      return [
        item.user_id,
        item.video_id,
        item.checked_time
      ]
    })
    pool.query(
      "INSERT INTO label_checked_cm (user_id, video_id, checked_time) " +
      "VALUES ?", [data],
      function (error, results) {
        if (error) throw error
        res.send(JSON.stringify({ "status": 200, "error": null, "response": results }))
      }
    )
  })

  // ラベルチェック済みCM一覧を返すAPI
  app.get("/api/getLabelsCheckedCM/:id", function (req, res) {
    const userId = req.params.id // ユーザー名
    pool.query(
      "SELECT video_id " +
      "FROM label_checked_cm " +
      "WHERE user_id = '" + userId + "' " +
      "GROUP BY video_id",
      function (error, results) {
        if (error) throw error
        res.send(results)
      }
    )
  })

  // ログインしたユーザー情報を返すAPI
  app.get('/api/getUserInfo', function (req, res) {
    // ログイン済みの場合
    if (req.user) {
      pool.query(
        "SELECT user_id " +
        "FROM user_info " +
        "WHERE user_id = (" +
        "SELECT user_id " +
        "FROM user_info " +
        "WHERE user_name = '" + req.user + "');",
        function (error, results) {
          if (error) throw error
          // 該当のIDと名前を返す
          res.send(JSON.stringify({ user_id: results[0].user_id, user_name: req.user }))
        }
      )
    }
    // ログイン済みでない場合、ゲスト情報を返す
    else {
      res.send(JSON.stringify({ user_id: 5, user_name: 'guest' }))
    }
  })
}