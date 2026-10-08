import express from 'express';
import cors from 'cors';
import authRoutes from './features/auth.js';
import problemRoutes from './features/problems.js';
import collectionRoutes from './features/collections.js';

const app = express();

app.use(cors());
app.use(express.json());

app.use('/api/auth', authRoutes);
app.use('/api/problems', problemRoutes);
app.use('/api/collections', collectionRoutes);

app.get('/', (_req, res) => {
  res.send('DSA Tracker Backend API is running...');
});

export default app;
