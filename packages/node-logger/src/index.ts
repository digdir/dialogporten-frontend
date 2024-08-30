import pino, { type LevelWithSilent } from 'pino'

// zodify
const formatLogsAsJson = process.env.LOGGER_FORMAT === 'json'

const DEFAULT_LOG_LEVEL = 'info'

// todo: zodify
const selectedLogLevel: LevelWithSilent = process.env.LOG_LEVEL as LevelWithSilent || DEFAULT_LOG_LEVEL
console.info(`node-logger: Log level set to ${selectedLogLevel}`)

const defaultOptions: pino.LoggerOptions = {
  formatters: {
    level: (label: string) => {
      // specify that we want to use the log level label instead of the value for easier consumption by third party services
      // label will be the actual textual representation of the log level (e.g. "info", "debug", "error", etc.)
      return { level: label }
    },
  },
  level: selectedLogLevel,
}

let logger: pino.Logger

if (formatLogsAsJson) {
  logger = pino({
    ...defaultOptions,
    // this timestamp is used by application insights to determine the timestamp of the log message
    // todo: double check and link to documentation
    timestamp: () => `,"TimeGenerated [UTC]":"${new Date().toISOString()}"`,
  })
} else {
  logger = pino(
    {
      ...defaultOptions,
    },
    pino.transport({
      target: 'pino-pretty',
      options: {
        destination: 1, // stdout
        colorize: true,
        levelFirst: true,
      },
    })
  )
}

export const createContextLogger = (
  context: Record<string | number | symbol, unknown>
) => {
  const child = logger.child(context)
  
  return {
    trace: child.trace,
    debug: child.debug,
    info: child.info,
    warn: child.warn,
    error: child.error,
    fatal: child.fatal,
    silent: child.silent,
  }
}

// todo: zodify
if (process.env.TEST_LOGGING) {
  logger.debug('Debug test')
  logger.trace('Trace test')
  logger.info({ some: 'object' }, 'Info test')
  logger.warn('Consider this a warning')
  logger.error(new Error('Test error'), 'Error test')
  logger.fatal(new Error('Test error'), 'Fatal test')
}

export default {
  trace: logger.trace,
  debug: logger.debug,
  info: logger.info,
  warn: logger.warn,
  error: logger.error,
  fatal: logger.fatal,
  silent: logger.silent,
}
