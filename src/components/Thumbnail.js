import React from 'react'
import { Link } from 'react-router-dom'

export default function Thumbnail({ videoId, imgPath, productName }) {
  return (
    <div className="item">
      <Link to={'result/' + videoId}>
        <img data-id={videoId}
          className="thumbnail"
          src={`${process.env.PUBLIC_URL}` + imgPath} />
      </Link>
      <Link to={'result/' + videoId}>
        <p className="video-name"
          data-id={videoId}>{productName}</p>
      </Link>
    </div>
  )
}