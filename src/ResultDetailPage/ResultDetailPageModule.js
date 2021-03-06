import React from 'react'
import { Fetch } from '../Provider/Fetch'
import { useParams } from 'react-router-dom'
import Breadcrumbs from '../components/Breadcrumbs'
import SceneList from './SceneList'
import CurrentProvider from '../Provider/CurrentProvider'
import ModeProvider from '../Provider/ModeProvider'
import AnnotationProvider from '../Provider/AnnotationProvider'
import CanvasProvider from '../Provider/CanvasProvider'
import SwitchScreen from './SwitchScreen'
import LabelScreen from './LabelScreen'
import CurrentScene from './CurrentScene'
import ContextMenuProvider from '../Provider/ContextMenuProvider'
import LabelsCheckBox from './LabelsCheckBox'

export default function ResultDetailPage() {
  const videoId = useParams().id  // 動画ID

  return (
    <ModeProvider>
      <CurrentProvider>
        <ContextMenuProvider>
          <AnnotationProvider>
            <CanvasProvider>
              <Fetch
                uri={`/api/result/` + videoId}
                renderSuccess={ResultDetailPageContents}
              />
            </CanvasProvider>
          </AnnotationProvider>
        </ContextMenuProvider>
      </CurrentProvider>
    </ModeProvider>
  )
}

// 結果詳細画面の各種コンテンツを表示する関数
function ResultDetailPageContents({ data }) {
  const videoId = data[0].video_id  // 動画データ
  const productName = data[0].product_name  // 作品名
  const sceneCount = [...new Set(data.map(item => item.scene_no))].length // 全シーン数

  /* 各種データの表示 */
  return (
    <div id="result-show">
      {/* パンくずリスト */}
      <Breadcrumbs productName={productName} />

      <div className='info-block'>
        {/* 作品名と現在のシーン数 */}
        <div className="video-info left">
          <div id="file-name">{productName}</div>
          <CurrentScene />
        </div>

        <div className='right'>
          <LabelsCheckBox videoId={videoId}/>
        </div>
      </div>

      {/* 動画データ（または画像データ＆バウンディングボックス）とラベルデータ */}
      <div id="result-screen">
        <SwitchScreen videoId={videoId} />
        <LabelScreen videoId={videoId} />
      </div>

      {/* シーン一覧 */}
      <SceneList videoId={videoId} sceneCount={sceneCount} />
    </div>
  )
}
