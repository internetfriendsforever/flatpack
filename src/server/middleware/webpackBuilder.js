const chalk = require('chalk')

module.exports = (compiler, name) => {
  const state = {
    stats: null,
    compiling: false,
    queue: []
  }

  compiler.plugin('compile', function () {
    state.compiling = true
    console.log(`🕗 Bundling ${name}…`)
  })

  compiler.plugin('done', function (stats) {
    const errors = stats.compilation.errors && stats.compilation.errors.length

    state.compiling = false
    state.stats = stats

    if (errors) {
      console.log(stats.toString({
        hash: false,
        version: false,
        chunks: false,
        assets: false,
        colors: true
      }))
    }

    console.log(errors
      ? chalk.red(`✘ Error bundling ${name}`)
      : chalk.green(`✔︎ Successfully bundled ${name}!`)
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
      console.log(`🕗 Bundling in progress (${name}). Queueing request…`)
      state.queue.push(proceed)
    } else {
      res.locals.webpack[name] = state
      proceed()
    }
  }
}
