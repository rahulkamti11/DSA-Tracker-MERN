import express from 'express';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import User from '../models/User.js';
import Problem from '../models/Problem.js';
import Collection from '../models/Collection.js';
import auth from '../middleware/auth.js';

const router = express.Router();

const today = () => new Date().toISOString().split('T')[0];
const addDays = (d, n) => { 
  const x = new Date(d); 
  x.setDate(x.getDate() + n); 
  return x.toISOString().split('T')[0]; 
};

// Seed Problems Helper
const getSeedProblems = (userId) => [
  { userId, name: 'Number of Islands', diff: 'Medium', status: 'Solved', tags: ['Graphs', 'BFS', 'DFS'], collId: 'top150', starred: true, notes: '## Approach\nUse DFS or BFS to traverse the grid. Mark visited land cells to avoid double counting.\n\n**Time:** O(M*N) | **Space:** O(M*N)', platforms: [{platform: 'LeetCode', url: 'https://leetcode.com/problems/number-of-islands/'}, {platform: 'GFG', url: 'https://www.geeksforgeeks.org/problems/find-the-number-of-islands/1'}], date: addDays(today(), -1), interval: 3, nextRev: addDays(today(), 2), revCount: 1 },
  { userId, name: 'Coin Change', diff: 'Medium', status: 'Solved', tags: ['Dynamic Programming'], collId: 'blind75', starred: true, notes: '## Approach\nBottom-up DP. Array of size `amount + 1` initialized to `amount + 1`.\n\n**Time:** O(S*n) | **Space:** O(S)', platforms: [{platform: 'LeetCode', url: 'https://leetcode.com/problems/coin-change/'}], date: addDays(today(), -2), interval: 3, nextRev: addDays(today(), 1), revCount: 2 },
  { userId, name: 'Merge K Sorted Lists', diff: 'Hard', status: 'Solved', tags: ['Heap', 'Linked List'], collId: 'top150', starred: false, notes: '## Approach\nUse a min-heap to keep track of the smallest node among the k linked lists. Extract min and add the next node from that list to the heap.\n\n**Time:** O(N log k) | **Space:** O(k)', platforms: [{platform: 'LeetCode', url: 'https://leetcode.com/problems/merge-k-sorted-lists/'}], date: addDays(today(), -3), interval: 5, nextRev: addDays(today(), 2), revCount: 1 },
  { userId, name: 'Two Sum', diff: 'Easy', status: 'Solved', tags: ['Array', 'Hash Table'], collId: 'blind75', starred: true, notes: '## Approach\nUse a hash map to store the difference between the target and the current element as you iterate.\n\n**Time:** O(n) | **Space:** O(n)', platforms: [{platform: 'LeetCode', url: 'https://leetcode.com/problems/two-sum/'}], date: addDays(today(), -5), interval: 14, nextRev: addDays(today(), 9), revCount: 4 },
  { userId, name: 'LRU Cache', diff: 'Medium', status: 'Attempted', tags: ['Design', 'Linked List', 'Hash Table'], collId: '', starred: false, notes: '', platforms: [{platform: 'LeetCode', url: 'https://leetcode.com/problems/lru-cache/'}, {platform: 'GFG', url: 'https://www.geeksforgeeks.org/problems/lru-cache/1'}], date: today(), interval: 1, nextRev: addDays(today(), 1), revCount: 0 },
  { userId, name: 'Valid Parentheses', diff: 'Easy', status: 'Solved', tags: ['String', 'Stack'], collId: 'blind75', starred: false, notes: '', platforms: [{platform: 'LeetCode', url: 'https://leetcode.com/problems/valid-parentheses/'}], date: addDays(today(), -10), interval: 30, nextRev: addDays(today(), 20), revCount: 5 },
  { userId, name: 'Median of Two Sorted Arrays', diff: 'Hard', status: 'Revisit', tags: ['Array', 'Binary Search'], collId: 'top150', starred: true, notes: '', platforms: [{platform: 'LeetCode', url: 'https://leetcode.com/problems/median-of-two-sorted-arrays/'}], date: addDays(today(), -15), interval: 1, nextRev: today(), revCount: 1 },
  { userId, name: 'Longest Palindromic Substring', diff: 'Medium', status: 'Solved', tags: ['String', 'Dynamic Programming'], collId: '', starred: false, notes: '', platforms: [{platform: 'LeetCode', url: 'https://leetcode.com/problems/longest-palindromic-substring/'}], date: addDays(today(), -20), interval: 14, nextRev: addDays(today(), -1), revCount: 3 },
  { userId, name: 'Climbing Stairs', diff: 'Easy', status: 'Solved', tags: ['Math', 'Dynamic Programming'], collId: 'blind75', starred: false, notes: '', platforms: [{platform: 'LeetCode', url: 'https://leetcode.com/problems/climbing-stairs/'}], date: addDays(today(), -4), interval: 7, nextRev: addDays(today(), 3), revCount: 1 },
  { userId, name: 'Search in Rotated Sorted Array', diff: 'Medium', status: 'Solved', tags: ['Array', 'Binary Search'], collId: 'blind75', starred: false, notes: '', platforms: [{platform: 'LeetCode', url: 'https://leetcode.com/problems/search-in-rotated-sorted-array/'}], date: addDays(today(), -2), interval: 3, nextRev: addDays(today(), 1), revCount: 2 }
];

// Register
router.post('/register', async (req, res) => {
  try {
    const { username, password, name } = req.body;
    if (!username || !password || !name) {
      return res.status(400).json({ message: 'Please enter all fields.' });
    }

    const existingUser = await User.findOne({ username });
    if (existingUser) {
      return res.status(400).json({ message: 'Username already exists.' });
    }

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    const newUser = new User({
      username,
      password: hashedPassword,
      name,
      activity: {}
    });
    const savedUser = await newUser.save();

    // Create default collections (only Starred)
    const defaultColls = [
      { userId: savedUser._id, id: 'starred', name: 'Starred' }
    ];
    await Collection.insertMany(defaultColls);

    // Generate token
    const token = jwt.sign({ id: savedUser._id }, process.env.JWT_SECRET || 'super_secret_dsa_tracker_key');
    res.json({
      token,
      user: {
        id: savedUser._id,
        username: savedUser.username,
        name: savedUser.name
      }
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Login
router.post('/login', async (req, res) => {
  try {
    const { username, password } = req.body;
    if (!username || !password) {
      return res.status(400).json({ message: 'Please enter all fields.' });
    }

    const user = await User.findOne({ username });
    if (!user) {
      return res.status(400).json({ message: 'No account with this username has been registered.' });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(400).json({ message: 'Invalid credentials.' });
    }

    // Auto-seed check in case user registered and somehow seeding failed
    const probCount = await Problem.countDocuments({ userId: user._id });
    if (probCount === 0) {
      const seedProblems = getSeedProblems(user._id);
      await Problem.insertMany(seedProblems);
      
      const collCount = await Collection.countDocuments({ userId: user._id });
      if (collCount === 0) {
        await Collection.insertMany([
          { userId: user._id, id: 'starred', name: 'Starred' },
          { userId: user._id, id: 'blind75', name: 'Blind 75' },
          { userId: user._id, id: 'top150', name: 'Top Interview 150' }
        ]);
      }

      const goalCount = await Goal.countDocuments({ userId: user._id });
      if (goalCount === 0) {
        const defaultGoal = new Goal({
          userId: user._id,
          total: 300,
          easy: 100,
          medium: 150,
          hard: 50
        });
        await defaultGoal.save();
      }
    }

    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET || 'super_secret_dsa_tracker_key');
    res.json({
      token,
      user: {
        id: user._id,
        username: user.username,
        name: user.name,
        activity: user.activity
      }
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Get User Profile & Activity
router.get('/me', auth, async (req, res) => {
  try {
    const user = await User.findById(req.user.id).select('-password');
    res.json(user);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Update/Log Activity Submission
router.post('/activity', auth, async (req, res) => {
  try {
    const user = await User.findById(req.user.id);
    if (!user) return res.status(404).json({ message: 'User not found' });

    const dateKey = today();
    const currentCount = user.activity.get(dateKey) || 0;
    user.activity.set(dateKey, currentCount + 1);

    await user.save();
    res.json(user.activity);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Guest Login
router.post('/guest-login', async (req, res) => {
  try {
    const guestUser = await User.findOne({ username: 'guest' });
    if (!guestUser) {
      return res.status(404).json({ message: 'Guest profile not seeded.' });
    }

    const token = jwt.sign({ id: guestUser._id }, process.env.JWT_SECRET || 'super_secret_dsa_tracker_key');
    res.json({
      token,
      user: {
        id: guestUser._id,
        username: guestUser.username,
        name: guestUser.name,
        activity: guestUser.activity
      }
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Sync Guest Data to User Profile
router.post('/sync', auth, async (req, res) => {
  try {
    const targetUserId = req.user.id;
    const guestUser = await User.findOne({ username: 'guest' });
    if (!guestUser) {
      return res.status(404).json({ message: 'Guest profile not found.' });
    }
    const guestUserId = guestUser._id;

    if (guestUserId.toString() === targetUserId.toString()) {
      return res.status(400).json({ message: 'Cannot sync guest to guest profile.' });
    }

    // 1. Move custom collections (userId migration)
    const defaultIds = ['starred', 'blind75', 'top150'];
    await Collection.updateMany(
      { userId: guestUserId, id: { $nin: defaultIds } },
      { userId: targetUserId }
    );

    // 2. Move problems
    await Problem.updateMany(
      { userId: guestUserId },
      { userId: targetUserId }
    );

    // 3. Sync goals (removed)

    // 4. Sync activity
    const targetUser = await User.findById(targetUserId);
    if (targetUser) {
      guestUser.activity.forEach((count, dateKey) => {
        const currentCount = targetUser.activity.get(dateKey) || 0;
        targetUser.activity.set(dateKey, currentCount + count);
      });
      await targetUser.save();
    }

    // 5. Reset guest profile in database for next guest sessions
    await resetGuest(guestUserId);

    res.json({ message: 'Guest data successfully migrated to user profile.' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Guest Reseed Helper
const resetGuest = async (guestId) => {
  await Problem.deleteMany({ userId: guestId });
  await Collection.deleteMany({ userId: guestId });
  
  const defaultColls = [
    { userId: guestId, id: 'starred', name: 'Starred' },
    { userId: guestId, id: 'blind75', name: 'Blind 75' },
    { userId: guestId, id: 'top150', name: 'Top Interview 150' }
  ];
  await Collection.insertMany(defaultColls);

  const seedProblems = getSeedProblems(guestId);
  await Problem.insertMany(seedProblems);
  
  await User.findByIdAndUpdate(guestId, { activity: {} });
};

// Seed Guest User on Start
export const seedGuest = async () => {
  try {
    const guestUser = await User.findOne({ username: 'guest' });
    if (!guestUser) {
      console.log('Seeding default guest profile in MongoDB...');
      const salt = await bcrypt.genSalt(10);
      const hashedPassword = await bcrypt.hash('guest', salt);

      const initialActivity = {
        [today()]: 2,
        [addDays(today(), -1)]: 1,
        [addDays(today(), -2)]: 3,
        [addDays(today(), -4)]: 1,
        [addDays(today(), -5)]: 4,
        [addDays(today(), -7)]: 2,
        [addDays(today(), -10)]: 1,
        [addDays(today(), -15)]: 5,
        [addDays(today(), -20)]: 2,
        [addDays(today(), -25)]: 3
      };

      const newGuest = new User({
        username: 'guest',
        password: hashedPassword,
        name: 'Guest',
        activity: initialActivity
      });
      const savedGuest = await newGuest.save();

      const defaultColls = [
        { userId: savedGuest._id, id: 'starred', name: 'Starred' },
        { userId: savedGuest._id, id: 'blind75', name: 'Blind 75' },
        { userId: savedGuest._id, id: 'top150', name: 'Top Interview 150' }
      ];
      await Collection.insertMany(defaultColls);

      // Create default goals (removed)

      const seedProblems = getSeedProblems(savedGuest._id);
      await Problem.insertMany(seedProblems);

      console.log('Default guest profile seeded successfully.');
    }
  } catch (err) {
    console.error('Error seeding guest user:', err.message);
  }
};

export default router;
