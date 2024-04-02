import startServer from './server';
const startTimeStamp = new Date();

try {
  startServer(startTimeStamp);
} catch (error) {
  console.error(error);
  process.exit(1);
}
