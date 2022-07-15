//NPM RUN DEV wrapper for lazy prebuilding before dev
/* eslint-disable @typescript-eslint/no-var-requires */
/* eslint-disable no-undef */
const fs = require('fs')
const spawn = require('cross-spawn')

function wire(spawned) {
  spawned.console.stdout.on('data', (data) => {
    console.log(data)
  })

  spawned.console.stderr.on('data', (data) => {
    console.error(data)
  })

  spawned.console.on('close', (code) => {
    console.log('lazy exit: ' + code)
  })
}

if (!fs.existsSync('.env')) {
  console.error('Missing .env file for server')
}

if (!fs.existsSync('node_modules')) {
  console.log('Node Modules not ready, npm i...')
  const result = spawn('npm', 'i', { stdio: 'inherit' })
  wire(result)
}

if (!fs.existsSync('dist')) {
  console.log('Dist pre build needed...')
  const result = spawn.sync('npm', ['run', 'build'])
  wire(result)
}

const dev = spawn.sync(
  'concurrently',
  ['"npx tsc --watch"', '"nodemon -q dist/src/index.js"']
  , { stdio: 'inherit' })

wire(dev)

