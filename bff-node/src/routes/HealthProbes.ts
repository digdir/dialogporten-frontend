import { app, bffVersion } from '..';
let migrationsuccessful = false;

export const isReady = () => migrationsuccessful;

export function startReadinessProbe(appName = 'noname') {
  console.log(bffVersion, ': ', "Starting Readiness probe for '" + appName);

  app.get('/readiness', (req, res) => {
    // Check if your application is ready
    // console.log(bffVersion, ': ', "Readiness probe for '" + appName + "' is called");
    res.send('OK');
    // if (isReady()) {
    //   res.sendStatus(200); // Respond with a 200 OK status when ready
    // } else {
    //   res.sendStatus(503); // Respond with a 503 Service Unavailable status when not ready
    // }
  });
}

// let testFlipValue = false;

export function startLivenessProbe(appName = 'noname') {
  console.log(bffVersion, ': ', "Starting Liveness probe for '" + appName);
  app.get('/liveness', (req, res) => {
    // Check if your application is ready
    // const isAlive = true;
    // console.log(
    //   bffVersion,
    //   "Liveness probe for '" + appName + "' is called. isAlive: ",
    //   isAlive,
    //   ' testFlipValue: ',
    //   testFlipValue
    // );
    // testFlipValue = !testFlipValue;
    res.send('OK');
    // if (isAlive) {
    //   res.sendStatus(200); // Respond with a 200 OK status when alive
    // } else {
    //   res.sendStatus(503); // Respond with a 503 Service Unavailable status when not alive
    // }
  });
}
