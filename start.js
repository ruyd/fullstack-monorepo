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

if (!fs.existsSync('server/.env')) {
  console.error('Missing .env file for server')
}

if (!fs.existsSync('client/.env')) {
  console.error('Missing .env file for server')
}

if (!fs.existsSync('node_modules')) {
  console.log('Node Modules not ready, npm i...')
  const result = spawn('npm', 'i', { stdio: 'inherit' })
  wire(result)
}

//nicely paired with vscode debug of server
const arg = process.execArgv[0] || 'client'

const dev = spawn.sync(
  'npm',
  ['run', arg]
  , { stdio: 'inherit' })

wire(dev)

