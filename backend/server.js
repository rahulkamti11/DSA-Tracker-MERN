import express from 'express';
import mongoose from 'mongoose';
import cors from 'cors';
import dotenv from 'dotenv';

// Import Routes
import authRoutes, { seedGuest } from './routes/auth.js';
import problemRoutes from './routes/problems.js';
import collectionRoutes from './routes/collections.js';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(express.json());

// Database Connection
const mongoURI = process.env.MONGO_URI || 'mongodb://127.0.0.1:27017/dsa_tracker';
mongoose.connect(mongoURI)
  .then(() => {
    console.log('Successfully connected to MongoDB.');
    seedGuest();
  })
  .catch((err) => console.error('MongoDB connection error:', err));

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/problems', problemRoutes);
app.use('/api/collections', collectionRoutes);

// Root Endpoint
app.get('/', (req, res) => {
  res.send('DSA Tracker Backend API is running...');
});

// Start Server
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
