//NPM RUN DEV wrapper for lazy prebuilding before dev
/* eslint-disable @typescript-eslint/no-var-requires */
/* eslint-disable no-undef */
const fs = require('fs')
const { exec } = require('child_process');

function wire(job) {
  job.stdout.on('data', (data) => {
    console.log(data)
  })

  job.stderr.on('data', (data) => {
    console.error(data)
  })

  job.on('close', (code) => {
    console.log('lazy exit: ' + code)
  })
  job.on('error', (code) => {
    console.error('error: ' + code)
  })
}

function wired(text) {
  const job = exec(text)
  wire(job)
  return job
}

function run() {
  const arg = process.execArgv[0] || 'run client'
  wired('npm ' + arg)
}

//RUN

if (!fs.existsSync('node_modules')) {
  console.warn('Initializing (npm i) workspace, client will load in ~3 minutes...')
  const job = wired('npm i')
  job.on('exit', () => run())
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

