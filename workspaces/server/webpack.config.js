/* eslint-disable @typescript-eslint/no-unused-vars */
console.log(`SERVER WEBPACK (${process.env.NODE_ENV})`)
const fs = require('fs')
const path = require('path')
const nodeExternals = require('webpack-node-externals')
const NodePolyfillPlugin = require('node-polyfill-webpack-plugin')
const ForkTsCheckerWebpackPlugin = require('fork-ts-checker-webpack-plugin')
const TsconfigPathsPlugin = require('tsconfig-paths-webpack-plugin')
const GeneratePackageJsonPlugin = require('generate-package-json-webpack-plugin')
const dotenv = require('dotenv')
const appConfig = require('./config/app.json')
const createEnvironmentHash = require('../../tools/createEnvironmentHash')
const getClientEnvironment = require('../../tools/env')
const paths = require('../../tools/paths')
const packageJson = require('./package.json')
const webpack = require('webpack')
const env = getClientEnvironment(paths.publicUrlOrPath.slice(0, -1))
const mode = env.mode
const isDevelopment = env.isDevelopment

function getLimitedEnv() {
  console.log('*** WPPORT', process.env.$PORT, process.env.PORT)

  return appConfig.envConcerns.reduce((acc, key) => {
    if (process.env[key]) acc[key] = process.env[key]
    return acc
  }, {})
}
const limitedEnv = getLimitedEnv()
const defineEnv = {
  ...limitedEnv,
  ...dotenv.config({ override: false }).parsed,
}

module.exports = {
  mode,
  entry: {
    index: './src/index.ts',
  },
  target: 'node',
  devtool: isDevelopment ? 'source-map' : false,
  output: {
    path: path.resolve(__dirname, 'dist'),
    filename: '[name].js',
    chunkFilename: '[name].[contenthash].js',
  },
  externalsPresets: { node: true },
  externals: [
    nodeExternals({
      additionalModuleDirs: [path.resolve(__dirname, '../../node_modules')],
      allowlist: ['ieee754'],
    }),
  ],
  plugins: [
    new ForkTsCheckerWebpackPlugin(),
    new NodePolyfillPlugin(),
    new GeneratePackageJsonPlugin({ ...packageJson, main: 'index.js' }),
    // new webpack.DefinePlugin({
    //   'process.env': JSON.stringify(defineEnv),
    // }),
  ],
  module: {
    rules: [
      {
        test: /\.tsx?$/,
        use: {
          loader: 'ts-loader',
          options: {
            projectReferences: true,
          },
        },
        exclude: /node_modules/,
      },
      {
        test: /\.json/,
        include: [path.resolve(__dirname, 'config')],
      },
    ],
  },
  resolve: {
    roots: [path.resolve(__dirname, 'src')],
    extensions: ['.tsx', '.ts', '.js'],
    plugins: [new TsconfigPathsPlugin({})],
  },
  cache: {
    type: 'filesystem',
    version: createEnvironmentHash(env.raw),
    cacheDirectory: paths.appWebpackCache,
    store: 'pack',
    buildDependencies: {
      defaultWebpack: ['webpack/lib/'],
      config: [__filename],
      tsconfig: [paths.appTsConfig, paths.appJsConfig].filter(f => fs.existsSync(f)),
    },
  },
}
