// DBへの接続・認証
const mysql = require('mysql')
const dbAuthData = require('./config/dbAuthData.json')  // DB認証データ
const pool = mysql.createPool(dbAuthData)

// DBへの再接続処理
const handleDisconnect = () => {
  pool.connect((err) => {
    if (err) {
      console.log('error connecting: ' + err.stack)
      return
    }
    console.log('success')
  })
}

// DB接続のエラーハンドリング
pool.on('error', function (err) {
  console.log('db error', err)
  if (err.code === 'PROTOCOL_PoocreatePool_LOST') {
    handleDisconnect()
  } else {
    throw err
  }
})

module.exports = pool;