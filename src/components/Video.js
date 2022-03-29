import React from 'react'
import { useCurrent } from '../Provider/CurrentProvider'

export default function Video({ videoId }) {
  const { currentScene } = useCurrent();  //  現在のシーン番号
  const videoPath = './result/scene/' + videoId + '/scene' + currentScene + '.mp4'  // 動画データのパス
  
  return (
    <video src={videoPath} controls='controls' autoPlay='autoplay'></video>
  )
}
