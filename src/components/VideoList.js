import React from 'react'
import Thumbnail from './Thumbnail'

export default function VideoList({ dataList, id }) {
  // 動画一覧
  const thumbnails = dataList.map(data => {
    const videoId = data.video_id // 動画ID
    const productName = data.product_name // 作品名
    const imgPath = './result/thumbnail/' + videoId + '/thumbnail1.jpg' // サムネ画像のパス
    
    return (
      <Thumbnail videoId={videoId} productName={productName} imgPath={imgPath} key={videoId} />
    )
  })
  
  return (
    <div id={id}>
      {thumbnails}
    </div>
  )
}
