import mongoose from 'mongoose';

const collectionSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  id: {
    type: String,
    required: true
  },
  name: {
    type: String,
    required: true,
    trim: true
  },
  description: {
    type: String,
    trim: true,
    default: ''
  },
  color: {
    type: String,
    default: 'blue'
  }
}, { timestamps: true });

// A user cannot have multiple collections with the same string id
collectionSchema.index({ userId: 1, id: 1 }, { unique: true });

const Collection = mongoose.model('Collection', collectionSchema);
export default Collection;
