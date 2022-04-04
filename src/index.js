import React from 'react'
import ReactDOM from 'react-dom'
import { BrowserRouter as Router } from 'react-router-dom'
import SceneAnalyzerApp from './SceneAnalyzerApp'
import 'core-js/stable'
import 'regenerator-runtime/runtime'

// 右クリックを禁止する
document.oncontextmenu = function () {
  return false
}

ReactDOM.render(
  <React.StrictMode>
    <Router>

      <SceneAnalyzerApp />

    </Router>
  </React.StrictMode>,
  document.getElementById('root')
)
