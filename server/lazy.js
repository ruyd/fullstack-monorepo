//NPM RUN DEV wrapper for lazy prebuilding before dev
/* eslint-disable @typescript-eslint/no-var-requires */
/* eslint-disable no-undef */
const fs = require('fs')
const { exec, execSync } = require('child_process');

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
  console.log(text)
  try {
    const spw = exec(text)
    wire(spw)
    return spw
  } catch (err) {
    console.error(err)
  }
  return null
}

function run() {
  wired('npx tsc --watch')
  wired('nodemon -q dist/src/index.js')
}

function runAsync(text) {
  return new Promise((resolve) => {
    try {
      const job = execSync(text)
      console.log(job)
      job.on('exit', (code) => {
        console.log('exited')
        resolve(code)
      })
    }
    catch {
      console.warn(' ✔ 🙌 You may ignore error above - maybe workplace npm i glitch"')
      resolve(-1)
    }
  })
}

async function init() {
  console.warn('node_modules and dist warm up...')
  await runAsync('npm i')
  console.log('finished npm')
  await runAsync('tsc')
  console.log('finished tsc')
  run()
}

//RUN

if (!fs.existsSync('node_modules')) {
  init()
  return
} else {
  console.info('node_modules: check')
}

if (!fs.existsSync('dist')) {
  init()
  return
} else {
  if (fs.existsSync('dist/packages')) {
    console.warn('Dist not combined: should be dist/src/server+packages')
    console.warn('Clean if needed then npm i @root/package to fix')
    wired('npm i @root/lib | tsc')
  } else {
    console.info('dist: check')
  }
}

if (!fs.existsSync('.env')) {
  console.error('Missing .env file for server')
}

run()