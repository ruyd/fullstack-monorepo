const fs = require('fs')
console.log('Applying secrets to config file')
const configFile = process.argv[2] || 'workspaces/server/config/app.json'
if (!configFile) {
  console.log('No config file specified')
  process.exit(1)
}
let config = fs.readFileSync(configFile, 'utf8')
const words = config.match(/\$[A-Z_]+/g)
if (words) {
  words.forEach(word => {
    console.log('Checking ' + word)
    const envVar = word.substr(1)
    if (process.env[envVar]) {
      console.log('Replacing ' + word, process.env[envVar])
      config = config.replace(word, process.env[envVar])
    }
  })
  fs.writeFileSync(configFile, config, { encoding: 'utf8' })
}
