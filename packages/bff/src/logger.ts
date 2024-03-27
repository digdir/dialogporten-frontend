import pino from 'pino';
import config from './config';

let transport:
  | pino.DestinationStream
  | undefined;

switch (config.logger.format) {
  case 'pretty':
    transport = pino.transport({
      target: 'pino-pretty',
      options: {
        colorize: true,
      },
    });
    break;
  case 'json':
  default:
    // use the default json transport
    transport = undefined;
}

const logger = pino({
  level: config.logger.level,
  timestamp: pino.stdTimeFunctions.isoTime,
  formatters: {
    level: (label: string) => {
      // specify that we want to use the log level label instead of the value for easier consumption by third party services
      return { level: label };
    },
  },
}, transport);

export default {
  debug: logger.debug.bind(logger),
  info: logger.info.bind(logger),
  warn: logger.warn.bind(logger),
  error: logger.error.bind(logger),
  fatal: logger.fatal.bind(logger),
};
