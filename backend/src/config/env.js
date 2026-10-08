import dotenv from 'dotenv';

dotenv.config();

export const env = {
  mongoUri: process.env.MONGO_URI || 'mongodb://127.0.0.1:27017/dsa_tracker',
  port: Number(process.env.PORT || 5000),
  jwtSecret: process.env.JWT_SECRET || 'super_secret_dsa_tracker_key',
};
