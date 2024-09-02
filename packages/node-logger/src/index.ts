import pino from 'pino';
import z from 'zod';

const envVariables = z.object({
  LOGGER_FORMAT: z.enum(['json', 'pretty']).default('pretty'),
  LOG_LEVEL: z.nativeEnum(pino.levels.labels).default('info'),
  TEST_LOGGING: z
    .enum(['true', 'false'])
    .transform((val) => val === 'true')
    .default('false'),
});

const env = envVariables.parse(process.env);

console.info(`node-logger: Log level set to ${env.LOG_LEVEL}`);

const defaultOptions: pino.LoggerOptions = {
  formatters: {
    level: (label: string) => {
      // specify that we want to use the log level label instead of the value for easier consumption by third party services
      // label will be the actual textual representation of the log level (e.g. "info", "debug", "error", etc.)
      return { level: label };
    },
  },
  level: env.LOG_LEVEL,
};

const prettyTransport = pino.transport({
  target: 'pino-pretty',
  options: {
    destination: 1, // stdout
    colorize: true,
    levelFirst: true,
  },
});

let logger: pino.Logger;

logger = pino(
  {
    ...defaultOptions,
  },
  env.LOGGER_FORMAT === 'json' ? undefined : prettyTransport,
);

export const createContextLogger = (context: Record<string | number | symbol, unknown>) => {
  const child = logger.child(context);

  return {
    trace: child.trace.bind(child),
    debug: child.debug.bind(child),
    info: child.info.bind(child),
    warn: child.warn.bind(child),
    error: child.error.bind(child),
    fatal: child.fatal.bind(child),
    silent: child.silent.bind(child),
  };
};

if (env.TEST_LOGGING) {
  logger.debug('Debug test');
  logger.trace('Trace test');
  logger.info({ some: 'object' }, 'Info test');
  logger.warn('Consider this a warning');
  logger.error(new Error('Test error'), 'Error test');
  logger.fatal(new Error('Test error'), 'Fatal test');
}

export default {
  trace: logger.trace.bind(logger),
  debug: logger.debug.bind(logger),
  info: logger.info.bind(logger),
  warn: logger.warn.bind(logger),
  error: logger.error.bind(logger),
  fatal: logger.fatal.bind(logger),
  silent: logger.silent.bind(logger),
};
