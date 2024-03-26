import express from 'express';
import config from '../config';

export function startReadinessProbe(app: express.Express, startTimeStamp: Date) {
  console.log(
    config.version,
    'Starting /readiness probe after ',
    (new Date().getTime() - startTimeStamp.getTime()) / 1000,
    'seconds',
  );
  app.get('/readiness', (req, res) => {
    res.send('OK');
  });
}

export function startLivenessProbe(app: express.Express, startTimeStamp: Date) {
  console.log(
    config.version,
    'Starting /liveness probe after ',
    (new Date().getTime() - startTimeStamp.getTime()) / 1000,
    'seconds',
  );
  app.get('/liveness', (req, res) => {
    res.send('OK');
  });
}
