//NPM RUN DEV wrapper for lazy prebuilding before dev
/* eslint-disable @typescript-eslint/no-var-requires */
/* eslint-disable no-undef */
const fs = require('fs')
const { execSync, exec, spawn } = require('child_process');

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
  const spw = spawn(text)
  wire(spw)
  return spw
}

function run() {
  const arg = process.execArgv[0] || 'run client'
  wired('npm ' + arg)
}

//RUN

if (!fs.existsSync('node_modules')) {
  console.warn('Running "npm i" for you, this will take a few...')
  const spw = wired('npm i')
  spw.on('close', () => run())
  return
} else {
  console.info('node_modules: check')
}

if (!fs.existsSync('server/.env')) {
  console.error('Missing .env file for server')
} else {
  console.info('senv: check')
}

if (!fs.existsSync('client/.env')) {
  console.error('Missing .env file for server')
} else {
  console.info('cenv: check')
}


run()

