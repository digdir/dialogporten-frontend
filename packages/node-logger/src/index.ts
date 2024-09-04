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

let pinoLogger: pino.Logger;

pinoLogger = pino(
  {
    ...defaultOptions,
  },
  env.LOGGER_FORMAT === 'json' ? undefined : prettyTransport,
);

export const createContextLogger = (context: Record<string | number | symbol, unknown>) => {
  const child = pinoLogger.child(context);

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
  pinoLogger.debug('Debug test');
  pinoLogger.trace('Trace test');
  pinoLogger.info({ some: 'object' }, 'Info test');
  pinoLogger.warn('Consider this a warning');
  pinoLogger.error(new Error('Test error'), 'Error test');
  pinoLogger.fatal(new Error('Test error'), 'Fatal test');
}

export const logger = {
  trace: pinoLogger.trace.bind(pinoLogger),
  debug: pinoLogger.debug.bind(pinoLogger),
  info: pinoLogger.info.bind(pinoLogger),
  warn: pinoLogger.warn.bind(pinoLogger),
  error: pinoLogger.error.bind(pinoLogger),
  fatal: pinoLogger.fatal.bind(pinoLogger),
  silent: pinoLogger.silent.bind(pinoLogger),
  pinoLoggerInstance: pinoLogger,
};
