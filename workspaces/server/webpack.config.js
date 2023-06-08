/* eslint-disable no-console */
console.log(`SERVER WEBPACK (${process.env.NODE_ENV})`)
const fs = require('fs')
const path = require('path')
const nodeExternals = require('webpack-node-externals')
const NodePolyfillPlugin = require('node-polyfill-webpack-plugin')
const ForkTsCheckerWebpackPlugin = require('fork-ts-checker-webpack-plugin')
const TsconfigPathsPlugin = require('tsconfig-paths-webpack-plugin')
const GeneratePackageJsonPlugin = require('generate-package-json-webpack-plugin')
const SwaggerJSDocWebpackPlugin = require('swagger-jsdoc-webpack-plugin')
const createEnvironmentHash = require('../../tools/createEnvironmentHash')
const getEnvironment = require('../../tools/env')
const paths = require('../../tools/paths')
const packageJson = require('./package.json')
const env = getEnvironment(paths.publicUrlOrPath.slice(0, -1))
const mode = env.raw.NODE_ENV?.toLowerCase() !== 'production' ? 'development' : 'production'
const isDevelopment = mode === 'development'

module.exports = {
  mode,
  entry: {
    index: './src/index.ts'
  },
  target: 'node',
  devtool: isDevelopment ? 'source-map' : false,
  output: {
    path: path.resolve(__dirname, 'dist'),
    filename: '[name].js',
    chunkFilename: '[name].[contenthash].js'
  },
  externalsPresets: { node: true },
  externals: [
    nodeExternals({
      additionalModuleDirs: [path.resolve(__dirname, '../../node_modules')],
      allowlist: ['ieee754'],
      bufferutil: 'bufferutil',
      'utf-8-validate': 'utf-8-validate'
    })
  ],
  plugins: [
    new ForkTsCheckerWebpackPlugin(),
    new NodePolyfillPlugin(),
    new GeneratePackageJsonPlugin({ ...packageJson, main: 'index.js' }),
    new SwaggerJSDocWebpackPlugin({
      definition: {
        openapi: '3.0.0',
        title: packageJson.name,
        description: packageJson.description
      },
      apis: [path.resolve(__dirname, './src/routes/*/index.ts'), './src/routes/swagger.yaml']
    })
  ],
  module: {
    rules: [
      {
        test: /\.tsx?$/,
        use: {
          loader: 'ts-loader',
          options: {
            projectReferences: true
          }
        },
        exclude: /node_modules/
      },
      {
        test: /\.json/
      }
    ]
  },
  resolve: {
    roots: [path.resolve(__dirname, 'src')],
    extensions: ['.tsx', '.ts', '.js'],
    plugins: [new TsconfigPathsPlugin({})]
  },
  cache: {
    type: 'filesystem',
    version: createEnvironmentHash(env.raw),
    cacheDirectory: paths.appWebpackCache,
    store: 'pack',
    buildDependencies: {
      defaultWebpack: ['webpack/lib/'],
      config: [__filename],
      tsconfig: [paths.appTsConfig, paths.appJsConfig].filter(f => fs.existsSync(f))
    }
  }
}
