import React, { useLayoutEffect} from 'react'
import { Link } from 'react-router-dom'

export default function Thumbnail({ videoId, imgPath, productName }) {
  /*
  useLayoutEffect(() => {
    const img = new Image()
    img.src = imgPath // プリロードする
  }, [])
  */
  return (
    <div className="item">
      <Link to={'/result/' + videoId}>
        <img data-id={videoId}
          className="thumbnail"
          src={imgPath} />
      </Link>
      <Link to={'/result/' + videoId}>
        <p className="video-name"
          data-id={videoId}>{productName}</p>
      </Link>
    </div>
  )
}
