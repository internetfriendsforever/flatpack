const chalk = require('chalk')

module.exports = (compiler, name) => {
  const state = {
    stats: null,
    compiling: false,
    queue: []
  }

  compiler.plugin('compile', function () {
    state.compiling = true
    console.log(`🔨 Building ${name}...`)
  })

  compiler.plugin('done', function (stats) {
    const errors = stats.compilation.errors && stats.compilation.errors.length

    const statsString = stats.toString({
      hash: false,
      version: false,
      chunks: false,
      colors: true
    })

    state.compiling = false
    state.stats = stats

    console.log('')
    console.log(statsString)
    console.log('')
    console.log(
      errors
      ? chalk.red(`✘ Build error: ${name}`)
      : chalk.green(`✔︎ Build success: ${name}`)
    )

    if (state.queue.length) {
      state.queue.forEach(next => next())
      state.queue = []
    }
  })

  compiler.watch(null, function (err, stats) {
    if (err) {
      throw err
    }
  })

  return (req, res, next) => {
    if (!res.locals.webpack) {
      res.locals.webpack = {}
    }

    const proceed = () => {
      res.locals.webpack[name] = state
      next()
    }

    if (state.compiling) {
      console.log(`🕥 Build in progress: ${name}. Queuing request...`)
      state.queue.push(proceed)
    } else {
      res.locals.webpack[name] = state
      proceed()
    }
  }
}
