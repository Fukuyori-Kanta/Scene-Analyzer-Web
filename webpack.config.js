const path = require('path')
module.exports = {
  entry: path.join(__dirname, 'src/index.js'),
  output: {
    path: path.join(__dirname, 'public'),
    filename: 'bundle.js'
  },
  devtool: 'inline-source-map',
  module: {
    rules: [
      {
        test: /.js$/,
        loader: 'babel-loader',
        options: {
          presets: ["@babel/preset-env","@babel/preset-react"]
          //presets: ["@babel/preset-env"]
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
    ]/*, 
    plugins: [
      new webpack.DefinePlugin({
        'process.env.NODE_ENV': JSON.stringify('development')
      })
    ]*/
  }
}

