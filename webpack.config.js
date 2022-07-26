const path = require('path')

const BundleAnalyzerPlugin = require('webpack-bundle-analyzer').BundleAnalyzerPlugin

module.exports = {
  entry: path.join(__dirname, 'src/index.js'),
  output: {
    path: path.join(__dirname, 'public'),
    publicPath: 'auto',
    filename: 'bundle.js'
  },
  devtool: 'inline-source-map',
  module: {
    rules: [
      {
        test: /.js$/,
        loader: 'babel-loader',
        options: {
          presets: ["@babel/preset-env", "@babel/preset-react"]
        }
      },
      {
        test: /\.css$/,
        use: [
          'style-loader',
          {
            loader: 'css-loader',
            options: {
              url: false
            }
          }
        ],
      },
      {
        //ローダの処理対象ファイル
        test: /\.(png|jpg|gif)$/i,
        //ローダの処理対象となるディレクトリ
        include: path.resolve(__dirname, 'public'),
        //利用するローダー
        loader: 'url-loader'
      }
    ]
  },
  cache: {
    type: 'filesystem',
    buildDependencies: {
      config: [__filename]
    }
  },
  // バンドルファイルのサイズ割合を表示（※確認時以外はコメントアウト）
  plugins: [
    new BundleAnalyzerPlugin()
  ]
}

