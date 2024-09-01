const path = require('path');
const webpack = require('webpack');
const CopyWebpackPlugin = require('copy-webpack-plugin');
const dotenv = require('dotenv');

// Load environment variables from a .env file if present
dotenv.config();

module.exports = {
  entry: './index.js',
  output: {
    path: path.resolve(__dirname, 'dist'),
    filename: 'bundle.js'
  },
  target: 'node',
  mode: 'production',
  plugins: [
    // new webpack.DefinePlugin({
    //   'process.env.API_KEY': JSON.stringify(process.env.API_KEY),
    //   'process.env.NODE_ENV': JSON.stringify(process.env.NODE_ENV)
    // }),
    new CopyWebpackPlugin({
      patterns: [
        { from: '_redirects', to: '' }
      ]
    })
  ]
};