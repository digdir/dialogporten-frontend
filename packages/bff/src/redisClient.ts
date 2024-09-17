import Redis from 'ioredis';
import config from './config.ts';
import { logger } from '@digdir/dialogporten-node-logger';

const redisClient = new Redis.default(config.redisConnectionString, {
  enableAutoPipelining: true,
});

redisClient.on('error', (err) => {
  logger.error(err, 'Redis Client Error');
});

redisClient.on('connect', () => {
  logger.info('Redis Client Connected');
});

redisClient.on('ready', () => {
  logger.info('Redis Client Ready');
});

redisClient.on('close', () => {
  logger.info('Redis Client Closed');
});

redisClient.on('reconnecting', () => {
  logger.info('Redis Client Reconnecting');
});

export default redisClient;