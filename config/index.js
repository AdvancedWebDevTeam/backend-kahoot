const environment = process.env;

const config = {
  DB_DATABASE: environment.DB_DATABASE,
  DB_USERNAME: environment.DB_USERNAME,
  DB_PASSWORD: environment.DB_PASSWORD,
  DB_HOST: environment.DB_HOST,
  BASE_URL: environment.BASE_URL,
  HOST: environment.HOST,
  SERVICE: environment.SERVICE,
  EMAIL_PORT: environment.EMAIL_PORT,
  SECURE: environment.SECURE,
  MY_EMAIL: environment.MY_EMAIL,
  MY_EMAIL_PASSWORD: environment.MY_EMAIL_PASSWORD
};

module.exports = config;
