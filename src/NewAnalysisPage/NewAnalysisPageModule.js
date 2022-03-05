import React from 'react'
import Breadcrumbs from '../components/Breadcrumbs'

class NewAnalysisPage extends React.Component {
	constructor(props) {
		super(props)
		// 状態の初期化
		this.state = {
			items: null // 読み込んだデータ保存用
		}
	}
	render() {
		return (
			<div id="exe">
				<Breadcrumbs />

				<div className="container">
					<div id="grid-A">
						<h2 className="heading margin-left">動画データの分析</h2>
					</div>

					<div id="grid-B" className="border-line">
						<div id="drop-area">
							ここにファイルをドラッグ＆ドロップして下さい。
                    <br />
                    複数のファイルを選択すれば一度に分析できます。
                </div>
					</div>

					<div id="grid-C" className="border-line">
						<div id="description">
							<h3 className="heading">説明文</h3>
							<p className="padding">動画を場面ごとに分割し、「何が映っているか」、「何をしているか」のラベルを付与します。</p>

							<h3 className="heading">工程</h3>
							<ol className="process">
								<li>カット分割</li>
								<li>ラベル付け</li>
								<li>シーンの統合</li>
								<li>ＣＭ好感度の付与</li>
							</ol>

							<p className="padding text-red">※入力ファイルは「.mp4」のみです。</p>
							<p className="padding text-red">※入力ファイルの上限は30MBです。</p>
						</div>
					</div>

					<div id="grid-D" className="border-line">
						<h3 className="heading margin-left">分析するファイル一覧<span id="file-num"></span> 件</h3>
						<h3 className="heading margin-right">合計ファイルサイズ<span id="file-size"></span></h3>
					</div>
					<div id="grid-E" className="border-line">
						<div id="file-list"><ul></ul></div>
					</div>

					<div id="grid-F" className="border-line">
						<div className="btn-wrapper">
							<button id="start-btn" className="button" type="button"><p>分析開始</p></button>
						</div>
					</div>
				</div>

				<div id="modal-main">
					<div className="video-info">
						<div id="file-name"></div>
						<div id="scene-no"></div>
					</div>

					<div id="result-screen">

						<div id="movie-screen" className="border-line"></div>

						<div id="label-screen" className="border-line">

							<h2 className="heading tag">このシーンのラベル一覧</h2>
							<h3 id="labels"></h3>
							<br />
							<h2 className="heading tag">このシーンの好感度</h2>

							<h3 id="favo"></h3>

							<div className="favo-gragh">
								<canvas id="canvas"></canvas>
							</div>
						</div>
					</div>

					<div className="scene-list-screen" className="border-line">
						<h4 className="heading margin-left">シーン分割結果（計 : <span id="scene-cnt"></span>シーン）</h4>
						<div id="scene-list" className="horizontal-scroll"></div>
					</div>

					<div className="switch-btn">
						<input className="prev-button" type="button" defaultValue="前の動画へ" />

						<input className="next-button" type="button" defaultValue="次の動画へ" />
					</div>
					<i id="clear_bt" className="material-icons clear_bt">clear</i>

				</div>

				<div id="my-spinner" className="box not-exe">
					<div className="spinner type1">
						<span>分析中...</span>
					</div>
				</div>
			</div>
		)
	}
}

export default NewAnalysisPage