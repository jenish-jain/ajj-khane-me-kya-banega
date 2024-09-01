const path = require('path');
const webpack = require('webpack');
const CopyWebpackPlugin = require('copy-webpack-plugin');
const dotenv = require('dotenv');

// Load environment variables from a .env file if present
dotenv.config();

module.exports = {
  entry: './index.js',
  output: {
    path: path.resolve(__dirname, 'public'),
    filename: 'bundle.js'
  },
  target: 'node',
  mode: 'production',
  plugins: [
    new webpack.DefinePlugin({
      'process.env.CLIENT_EMAIL': process.env.CLIENT_EMAIL,
      'process.env.PRIVATE_KEY': process.env.PRIVATE_KEY
    }),
    new CopyWebpackPlugin({
      patterns: [
        { from: '_redirects', to: '' }
      ]
    })
  ]
};