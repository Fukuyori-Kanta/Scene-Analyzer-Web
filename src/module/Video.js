import React, { useState, useEffect } from "react"
import { useCurrent } from "./CurrentProvider"

export default function Video({ videoId }) {
  const { currentNo } = useCurrent();
  const videoPath = '/result/scene/' + videoId + '/scene' + currentNo + '.mp4'
  
  return (
    <video src={`${process.env.PUBLIC_URL}` + videoPath} controls="controls" autoPlay="autoplay"></video>
  )
}