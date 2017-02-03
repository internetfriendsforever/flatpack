import commander from 'commander'

import setup from './setup'
import start from './start'
import destroy from './destroy'

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
