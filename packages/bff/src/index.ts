import startServer from './server';

try {
  const startTimeStamp = new Date();
  void startServer(startTimeStamp);
} catch (error) {
  console.error(error);
  process.exit(1);
}
