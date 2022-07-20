//NPM RUN DEV wrapper for lazy prebuilding before dev
/* eslint-disable @typescript-eslint/no-var-requires */
/* eslint-disable no-undef */
const fs = require('fs')
const { exec } = require('child_process');
const options = { env: { FORCE_COLOR: true } }
const heroku = process.env._ && process.env._.indexOf("heroku") !== -1

function wired(text) {
  const job = exec(text, options)
  job.stdout.pipe(process.stdout)
  job.stderr.pipe(process.stdout)
  return job
}

function run() {
  console.log(process.env)
  if (heroku) {
    wired('npm start -w server')
    return
  }
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
  console.warn('client .env needs setup, creating... 👀')
  const cfg = fs.readFileSync("setup/sample.env")
  fs.writeFileSync("server/.env", cfg)
} else {
  console.info('senv: check')
}

if (!fs.existsSync('client/.env')) {
  console.warn('client .env needs setup, creating... 👀')
  const cfg = fs.readFileSync("client/setup/sample.env")
  fs.writeFileSync("client/.env", cfg)
} else {
  console.info('cenv: check')
}


run()

