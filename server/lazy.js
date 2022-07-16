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
      console.warn(' ✔ 🙌 You may ignore error above - maybe npm i workplaces glitch"')
      resolve(-1)
    }
  })
}

async function init() {
  console.warn('Warming up node_modules and dist, will take a few...')
  await runAsync('npm i')
  console.log('node_modules: ✔')
  await runAsync('tsc')
  if (fs.existsSync('dist')) {
    console.log('dist: ✔')
    run()
  } else {
    console.error('something went wrong, dist not generated, aborting...')
    return
  }
}

//RUN

if (!fs.existsSync('.env')) {
  console.warn('.env needs setup, creating... 👀')
  const cfg = fs.readFileSync("setup/sample.env")
  fs.writeFileSync(".env", cfg)
}

if (!fs.existsSync('node_modules')) {
  init()
  return
} else {
  console.info('node_modules: ✔')
}

if (!fs.existsSync('dist')) {
  init()
  return
} else {
  if (fs.existsSync('dist/packages')) {
    console.warn('dist/src/ not combining output, happens when @root/lib not present|resolved')
    console.warn('npm "run clean" then "i @root/lib" to fix 🙌')
    wired('npm i @root/lib | tsc')
  } else {
    console.info('dist: ✔')
  }
}

run()