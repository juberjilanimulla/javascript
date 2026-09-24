import "dotenv/config";

const config = {
  PORT: process.env.PORT,
  PRODDEV: process.env.PRODDEV || "prod",
  APIKEY: process.env.APIKEY,
  FRONTEND_PATH: process.env.FRONTEND_PATH,

  // MySQL
  DB_HOST: process.env.DB_HOST,
  DB_PORT: process.env.DB_PORT,
  DB_USER: process.env.DB_USER,
  DB_PASSWORD: process.env.DB_PASSWORD,
  DB_NAME: process.env.DB_NAME,
};

export default config;