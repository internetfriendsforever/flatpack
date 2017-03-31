const mimeTypes = require('mime-types')
const MemoryFS = require('memory-fs')
const webpack = require('webpack')
const getWebpackConfig = require('../../getWebpackConfig')

const icon = '🛠'

const config = getWebpackConfig('production')
const compiler = webpack(config)
const fs = new MemoryFS()

module.exports = (req, res) => {
  console.log(icon, 'Compiling production scripts…')

  compiler.outputFileSystem = fs

  compiler.run((error, stats) => {
    if (error) {
      console.log(error)
      return res.status(500).json({ error })
    }

    const assets = stats.toJson().assets

    console.log(icon, 'Compiled', assets.length, 'scripts')

    const files = assets.map(asset => {
      console.log(icon, `Reading ${asset.name}…`)

      const path = `${config.output.path}/${asset.name}`

      const data = fs.readFileSync(path)

      return {
        path: asset.name,
        type: mimeTypes.lookup(asset.name),
        data: data.toString('base64')
      }
    })

    console.log(icon, 'Done!')

    return res.status(200).json({
      files,
      stats: stats.toJson()
    })
  })
}
