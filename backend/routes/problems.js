import express from 'express';
import Problem from '../models/Problem.js';
import auth from '../middleware/auth.js';

const router = express.Router();

// Get active problems (not deleted)
router.get('/', auth, async (req, res) => {
  try {
    const problems = await Problem.find({ userId: req.user.id, isDeleted: false }).sort({ createdAt: -1 });
    res.json(problems);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Get recycle bin problems (deleted)
router.get('/trash', auth, async (req, res) => {
  try {
    const trash = await Problem.find({ userId: req.user.id, isDeleted: true }).sort({ delDate: -1 });
    res.json(trash);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Add a problem
router.post('/', auth, async (req, res) => {
  try {
    const { name, diff, status, tags, collId, starred, notes, platforms, date, interval, nextRev, revCount, noRep } = req.body;
    if (!name) {
      return res.status(400).json({ message: 'Problem name is required.' });
    }

    const newProblem = new Problem({
      userId: req.user.id,
      name,
      diff,
      status,
      tags,
      collId,
      starred,
      notes,
      platforms,
      date,
      interval,
      nextRev,
      revCount,
      noRep
    });

    const savedProblem = await newProblem.save();
    res.json(savedProblem);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Update a problem
router.put('/:id', auth, async (req, res) => {
  try {
    const { name, diff, status, tags, collId, starred, notes, platforms, date, interval, nextRev, revCount, noRep } = req.body;
    
    const problem = await Problem.findOne({ _id: req.params.id, userId: req.user.id });
    if (!problem) {
      return res.status(404).json({ message: 'Problem not found or unauthorized' });
    }

    if (name !== undefined) problem.name = name;
    if (diff !== undefined) problem.diff = diff;
    if (status !== undefined) problem.status = status;
    if (tags !== undefined) problem.tags = tags;
    if (collId !== undefined) problem.collId = collId;
    if (starred !== undefined) problem.starred = starred;
    if (notes !== undefined) problem.notes = notes;
    if (platforms !== undefined) problem.platforms = platforms;
    if (date !== undefined) problem.date = date;
    if (interval !== undefined) problem.interval = interval;
    if (nextRev !== undefined) problem.nextRev = nextRev;
    if (revCount !== undefined) problem.revCount = revCount;
    if (noRep !== undefined) problem.noRep = noRep;

    const updatedProblem = await problem.save();
    res.json(updatedProblem);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Soft delete (Move to Trash) or Restore from Trash
router.put('/:id/trash', auth, async (req, res) => {
  try {
    const { isDeleted, delDate } = req.body;
    
    const problem = await Problem.findOne({ _id: req.params.id, userId: req.user.id });
    if (!problem) {
      return res.status(404).json({ message: 'Problem not found or unauthorized' });
    }

    problem.isDeleted = isDeleted;
    problem.delDate = isDeleted ? (delDate || new Date().toISOString().split('T')[0]) : null;

    const updatedProblem = await problem.save();
    res.json(updatedProblem);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Empty trash (Permanently delete all soft-deleted problems)
router.delete('/trash/empty', auth, async (req, res) => {
  try {
    await Problem.deleteMany({ userId: req.user.id, isDeleted: true });
    res.json({ message: 'Recycle bin cleared' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Permanently delete a single problem
router.delete('/:id', auth, async (req, res) => {
  try {
    const problem = await Problem.findOneAndDelete({ _id: req.params.id, userId: req.user.id });
    if (!problem) {
      return res.status(404).json({ message: 'Problem not found or unauthorized' });
    }
    res.json({ message: 'Problem permanently deleted', id: req.params.id });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

export default router;
