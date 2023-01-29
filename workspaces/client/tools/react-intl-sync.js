const globSync = require('glob/sync')
const fs = require('fs')
const path = require('path')
const EXTRACT_FILE = 'extract.json'
const DIR = path.resolve(__dirname, '../src/features/languages')
const MESSAGES = require(`${DIR}/${EXTRACT_FILE}`)

const seenIds = new Set()
const extract = Object.keys(MESSAGES).reduce((acc, key) => {
  const { defaultMessage } = MESSAGES[key]
  const id = key
  if (seenIds.has(id)) {
    throw new Error(`Duplicate message descriptor ID: ${id}`)
  }
  seenIds.add(id)
  if (defaultMessage.includes('\n')) {
    throw new Error(`Default message from ${id} contains a line break: ${defaultMessage}`)
  }
  acc[key] = defaultMessage
  return acc
}, {})

const write = (localeFileName, data) =>
  fs.writeFileSync(`${DIR}/${localeFileName}`, JSON.stringify(data, null, 2))

// if en does not exist just create that
if (!fs.existsSync(`${DIR}/en.json`)) {
  write('en.json', extract)
  return
}

globSync(`${DIR}/*.json`).forEach(filename => {
  if (filename.includes(EXTRACT_FILE)) return
  const locale = filename.split('/').pop()
  const fileContent = JSON.parse(fs.readFileSync(filename, 'utf8'))
  const merged = { ...extract, ...fileContent }
  write(locale, merged)
})
