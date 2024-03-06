// Read the .env file.
import * as dotenv from 'dotenv'

// Require the framework
import Fastify from 'fastify'

// Require library to exit fastify process, gracefully (if possible)
import closeWithGrace from 'close-with-grace'

// Import your application
import appService from './app.js'

// Dotenv config
dotenv.config()

const LOG_LEVEL = process.env.LOG_LEVEL || 'info';
const PORT = process.env.PORT || '8000';
const LISTEN = process.env.LISTEN || '127.0.0.1'

// Instantiate Fastify with some config
const app = Fastify({
  logger: {
    level: LOG_LEVEL,
    transport: LOG_LEVEL == 'debug' ? {
      target: 'pino-pretty',
      options: {
        translateTime: 'mm-dd HH:MM:ss',
        ignore: 'pid,hostname'
      }
    } : null
  }
})

// Register your application as a normal plugin.
app.register(appService)

// delay is the number of milliseconds for the graceful close to finish
const closeListeners = closeWithGrace({ delay: process.env.FASTIFY_CLOSE_GRACE_DELAY || 500 }, async function ({ signal, err, manual }) {
  if (err) {
    app.log.error(err, signal, manual)
  }
  await app.close()
})

app.addHook('onClose', async (instance, done) => {
  closeListeners.uninstall()
  done()
})

// Start listening.
app.listen({ port: PORT, host: LISTEN }, (err) => {
  if (err) {
    app.log.error(err)
    process.exit(1)
  }
})
