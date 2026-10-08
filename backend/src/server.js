import app from './app.js';
import { connectDb } from './config/db.js';
import { env } from './config/env.js';
import { seedGuest } from './features/auth.js';

const startServer = async () => {
  try {
    await connectDb();
    await seedGuest();

    app.listen(env.port, () => {
      console.log(`Server is running on port ${env.port}`);
    });
  } catch (error) {
    console.error('Failed to start backend:', error);
    process.exit(1);
  }
};

startServer();
