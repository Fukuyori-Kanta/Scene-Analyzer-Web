import React from "react"
import { useCurrent } from "../Provider/CurrentProvider"

export default function Video({ videoId }) {
  const { currentScene } = useCurrent();
  const videoPath = '/result/scene/' + videoId + '/scene' + currentScene + '.mp4'
  
  return (
    <video src={`${process.env.PUBLIC_URL}` + videoPath} controls="controls" autoPlay="autoplay"></video>
  )
}