import React from 'react'
import ReactDOM from 'react-dom'
import SceneAnalyzerApp from './SceneAnalyzerApp'
import 'core-js/stable'
import 'regenerator-runtime/runtime'

// 右クリックを禁止する
document.oncontextmenu = function () {
  return false
}

ReactDOM.render(
  <React.StrictMode>
    <SceneAnalyzerApp />
  </React.StrictMode>, 
  document.getElementById('root')
)
