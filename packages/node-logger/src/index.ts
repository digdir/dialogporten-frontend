import pino from 'pino'

const shouldFormatLogsToJSON = process.env.LOGGER_FORMAT === 'json'

const DEFAULT_LOG_LEVEL = 'info'

const defaultOptions: pino.LoggerOptions = {
  formatters: {
    level: (label: string) => {
      // specify that we want to use the log level label instead of the value for easier consumption by third party services
      return { level: label }
    },
  },
}

let logger: pino.Logger

if (shouldFormatLogsToJSON) {
  logger = pino({
    ...defaultOptions,
    // this timestamp is used by application insights to determine the timestamp of the log message
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

type LogLevel = 'trace' | 'debug' | 'info' | 'warn' | 'error' | 'fatal' | 'silent'

const selectedLogLevel: LogLevel = process.env.LOG_LEVEL as LogLevel
if (selectedLogLevel && logger.levels.values[selectedLogLevel]) {
  const logLevelVal = logger.levels.values[selectedLogLevel]
  logger.level = logger.levels.labels[logLevelVal]
  console.info(`node-logger: Log level set to ${selectedLogLevel}`)
} else {
  logger.level = DEFAULT_LOG_LEVEL
  console.info(
    `node-logger: Log level set to default log level ${DEFAULT_LOG_LEVEL}`
  )
}

export const createContextLogger = (
  context: Record<string | number | symbol, unknown>
) => {
  const child = logger.child(context)

  return {
    trace: child.trace.bind(child),
    debug: child.debug.bind(child),
    info: child.info.bind(child),
    warn: child.warn.bind(child),
    error: child.error.bind(child),
    fatal: child.fatal.bind(child),
    silent: child.silent.bind(child),
  }
}

if (process.env.TEST_LOGGING) {
  logger.debug('Debug test')
  logger.trace('Trace test')
  logger.info({ some: 'object' }, 'Info test')
  logger.warn('Consider this a warning')
  logger.error(new Error('Test error'), 'Error test')
  logger.fatal(new Error('Test error'), 'Fatal test')
}

export default {
  trace: logger.trace.bind(logger),
  debug: logger.debug.bind(logger),
  info: logger.info.bind(logger),
  warn: logger.warn.bind(logger),
  error: logger.error.bind(logger),
  fatal: logger.fatal.bind(logger),
  silent: logger.silent.bind(logger),
}
