//NPM RUN DEV wrapper for lazy prebuilding before dev
/* eslint-disable @typescript-eslint/no-var-requires */
/* eslint-disable no-undef */
const fs = require('fs')
const { exec, execSync } = require('child_process');
const options = { env: { FORCE_COLOR: true } }

function wired(text) {
  console.log(text)
  const job = exec(text, options)
  job.stdout.pipe(process.stdout)
  return new Promise((resolve) => {
    job.on('exit', () => resolve())
  })
}

async function run() {
  wired('npx tsc --watch')
  //Doesn't debug unless execd directly
  const job = exec('nodemon -q dist/src/index.js')
  job.stdout.pipe(process.stdout)
}

function runAsync(text) {
  return new Promise((resolve) => {
    try {
      const job = execSync(text, options)
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