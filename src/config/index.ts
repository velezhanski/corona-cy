import dotenv from 'dotenv';

// Set the NODE_ENV to 'development' by default
// CHANGE THIS
process.env.NODE_ENV = process.env.NODE_ENV || 'prod';

const envFound = dotenv.config();
if (envFound.error && process.env.NODE_ENV == 'development') {
  throw new Error("⚠️  Couldn't find .env file  ⚠️");
}

export default {
  port: process.env.PORT || 3000,
  telegram: {
    token: process.env.BOT_TOKEN
  },
  heroku: {
    url: process.env.HEROKU_URL
  }
};
