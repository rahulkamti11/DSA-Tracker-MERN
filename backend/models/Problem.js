import mongoose from 'mongoose';

const platformSchema = new mongoose.Schema({
  platform: { type: String, required: true },
  url: { type: String, required: true }
}, { _id: false });

const problemSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  name: {
    type: String,
    required: true,
    trim: true
  },
  diff: {
    type: String,
    enum: ['Easy', 'Medium', 'Hard'],
    default: 'Medium'
  },
  status: {
    type: String,
    enum: ['Solved', 'Attempted', 'Revisit'],
    default: 'Solved'
  },
  tags: [{
    type: String,
    trim: true
  }],
  collId: {
    type: String,
    default: ''
  },
  starred: {
    type: Boolean,
    default: false
  },
  notes: {
    type: String,
    default: ''
  },
  platforms: [platformSchema],
  date: {
    type: String,
    required: true
  },
  interval: {
    type: Number,
    default: 1
  },
  nextRev: {
    type: String,
    default: null
  },
  revCount: {
    type: Number,
    default: 0
  },
  noRep: {
    type: Boolean,
    default: false
  },
  isDeleted: {
    type: Boolean,
    default: false
  },
  delDate: {
    type: String,
    default: null
  }
}, { timestamps: true });

const Problem = mongoose.model('Problem', problemSchema);
export default Problem;
