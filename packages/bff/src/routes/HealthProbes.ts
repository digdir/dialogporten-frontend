import { app, bffVersion } from '..';
const migrationsuccessful = false;

export const isReady = () => migrationsuccessful;

export function startReadinessProbe(startTimeStamp: Date) {
  console.log(
    bffVersion,
    'Starting /readiness probe after ',
    (new Date().getTime() - startTimeStamp.getTime()) / 1000,
    'seconds',
  );
  app.get('/readiness', (req, res) => {
    res.send('OK');
  });
}

export function startLivenessProbe(startTimeStamp: Date) {
  console.log(
    bffVersion,
    'Starting /liveness probe after ',
    (new Date().getTime() - startTimeStamp.getTime()) / 1000,
    'seconds',
  );
  app.get('/liveness', (req, res) => {
    res.send('OK');
  });
}
