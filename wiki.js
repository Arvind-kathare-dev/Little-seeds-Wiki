try {
  console.log('Starting Wiki.js...')
  require('./server')
} catch (err) {
  console.error('CRITICAL ERROR DURING STARTUP:')
  console.error(err)
  process.exit(1)
}
