import express from 'express';
import Collection from '../models/Collection.js';
import Problem from '../models/Problem.js';
import auth from '../middleware/auth.js';

const router = express.Router();

// Get all collections for the user
router.get('/', auth, async (req, res) => {
  try {
    const collections = await Collection.find({ userId: req.user.id });
    res.json(collections);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Create a new collection
router.post('/', auth, async (req, res) => {
  try {
    const { id, name, description, color } = req.body;
    if (!id || !name) {
      return res.status(400).json({ message: 'Collection ID and name are required.' });
    }

    const newCollection = new Collection({
      userId: req.user.id,
      id,
      name,
      description,
      color: color || 'blue'
    });

    const savedCollection = await newCollection.save();
    res.json(savedCollection);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Update collection name
router.put('/:id', auth, async (req, res) => {
  try {
    const { name } = req.body;
    if (!name) {
      return res.status(400).json({ message: 'Collection name is required.' });
    }

    const collection = await Collection.findOne({ id: req.params.id, userId: req.user.id });
    if (!collection) {
      return res.status(404).json({ message: 'Collection not found or unauthorized' });
    }

    collection.name = name;
    const updatedCollection = await collection.save();
    res.json(updatedCollection);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Delete collection
router.delete('/:id', auth, async (req, res) => {
  try {
    const collection = await Collection.findOneAndDelete({ id: req.params.id, userId: req.user.id });
    if (!collection) {
      return res.status(404).json({ message: 'Collection not found or unauthorized' });
    }

    // Also update all problems that belonged to this collection to have collId = ""
    await Problem.updateMany(
      { userId: req.user.id, collId: req.params.id },
      { collId: '' }
    );

    res.json({ message: 'Collection deleted successfully', id: req.params.id });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

export default router;
