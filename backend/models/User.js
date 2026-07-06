import mongoose from 'mongoose';

const userSchema = new mongoose.Schema({
  username: {
    type: String,
    required: true,
    unique: true,
    trim: true,
    lowercase: true
  },
  password: {
    type: String,
    required: true
  },
  name: {
    type: String,
    required: true
  },
  activity: {
    type: Map,
    of: Number,
    default: {}
  }
}, { timestamps: true });

const User = mongoose.model('User', userSchema);
export default User;
