import logger from 'winston';

// eslint-disable-next-line import/prefer-default-export
export function checkEnv() {
  const envVariables = ['GITHUB_CLIENT_ID', 'GITHUB_CLIENT_SECRET', 'DATABASE_URL'];
  envVariables.forEach((env) => {
    if (!process.env[env]) {
      throw new Error(`Env variable ${env} not set`);
    }
  });

  if (!process.env.MAIL_URL) {
    logger.log(
      'warn',
      'You have not set the MAIL_URL env variable, you will not be able to send mails via the app',
    ); // eslint-disable-line no-console
  }
  if (!process.env.BASE_URL) {
    logger.log(
      'warn',
      'You have not set the BASE_URL env variable, the default url is now http://localhost:3000',
    ); // eslint-disable-line no-console
    process.env.BASE_URL = 'http://localhost:3000';
  }
  if (!process.env.SESSION_SECRET) {
    logger.log(
      'warn',
      'You have not set the SESSION_SECRET env variable, we use "secret" as a default secret but it is not good for production',
    ); // eslint-disable-line no-console
    process.env.BASE_URL = 'secret';
  }
}
