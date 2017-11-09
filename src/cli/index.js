#! /usr/bin/env node

const commander = require('commander')
const start = require('./start')

commander.version('0.0.0')

commander
  .command('start')
  .description('Start local development server')
  .action(start)

commander.parse(process.argv)
