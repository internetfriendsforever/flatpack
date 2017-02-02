const fs = require('fs')
const path = require('path')

const packageJsonPath = path.resolve(process.cwd(), 'package.json')

let relativePath = 'index.js'

if (fs.existsSync(packageJsonPath)) {
  const packageFileContents = fs.readFileSync(packageJsonPath, 'utf-8')

  try {
    const main = JSON.parse(packageFileContents).main

    if (main) {
      relativePath = main
    }
  } catch (e) {
    throw new Error(`package.json: ${e.message}`)
  }
}

const configPath = path.resolve(process.cwd(), relativePath)

if (!fs.existsSync(configPath)) {
  throw new Error(`Main script '${configPath}' does not exist`)
}

module.exports = configPath
