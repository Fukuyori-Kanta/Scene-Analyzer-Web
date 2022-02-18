import React from 'react'
import Thumbnail from './Thumbnail'

export default function VideoList({ dataList, id }) {
  // 動画一覧
  const thumbnails = dataList.map(data => {
    const videoId = data.video_id
    const productName = data.product_name
    const imgPath = '/result/thumbnail/' + videoId + '/thumbnail1.jpg'
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