//NPM RUN DEV wrapper for lazy prebuilding before dev
/* eslint-disable @typescript-eslint/no-var-requires */
/* eslint-disable no-undef */
const fs = require('fs')
const { exec } = require('child_process');

function wire(spw) {
  spw.stdout.on('data', (data) => {
    console.log(data)
  })

  spw.stderr.on('data', (data) => {
    console.error(data)
  })

  spw.on('close', (code) => {
    console.log('lazy exit: ' + code)
  })
  spw.on('error', (code) => {
    console.error('error: ' + code)
  })
}

function wired(text) {
  const spw = exec(text)
  wire(spw)
  return spw
}

const dev = 'concurrently "npx tsc --watch" "nodemon -q dist/src/index.js"'
function run() {
  const arg = process.execArgv[0]
  wired(arg ? 'npm ' + arg : dev)
}

//RUN

if (!fs.existsSync('node_modules')) {
  console.warn('npm install, will load in ~3 minutes...')
  const spw = wired('npm i')
  spw.on('close', () => run())
  return
} else {
  console.info('node_modules: check')
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
