import React from 'react'
import ReactDOM from 'react-dom'
import SceneAnalyzerApp from './SceneAnalyzerApp'
import "core-js/stable"
import "regenerator-runtime/runtime"
//import reportWebVitals from './reportWebVitals'

ReactDOM.render(
  <React.StrictMode>

    <SceneAnalyzerApp />
    {/*<img src="./result/thumbnail/A211079486/thumbnail1.jpg" />*/}
  </React.StrictMode>, 
  document.getElementById('root')
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
//reportWebVitals()
