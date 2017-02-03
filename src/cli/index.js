#! /usr/bin/env node

const commander = require('commander')

const setup = require('./setup')
const start = require('./start')
const destroy = require('./destroy')

commander.version('0.0.0')

commander
  .command('setup')
  .description('Set up AWS configuration with prompt')
  .action(setup)

commander
  .command('start')
  .description('Start local development server')
  .action(start)

commander
  .command('destroy')
  .description('Tear down AWS configuration')
  .action(destroy)

commander.parse(process.argv)
