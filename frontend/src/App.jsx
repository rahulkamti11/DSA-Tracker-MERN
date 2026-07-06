import React, { useState, useEffect, useMemo, useRef } from 'react';
import { LayoutDashboard, ListTodo, RotateCcw, Tags, FolderHeart, Target, Activity, Trash2, Menu, X, Plus, Star, Search, LogIn, LogOut, BookOpen, Settings, Keyboard, Download, ChevronDown, Check, Pencil, Recycle, Eye } from 'lucide-react';

// --- UTILITIES ---
const uid = () => Date.now().toString(36) + Math.random().toString(36).slice(2);
const today = () => new Date().toISOString().split('T')[0];
const addDays = (d, n) => { const x = new Date(d); x.setDate(x.getDate() + n); return x.toISOString().split('T')[0]; };
const formatDate = (dateStr) => {
  if (!dateStr) return '';
  const d = new Date(dateStr);
  return d.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
};
const getPlatformInfo = (name) => {
  const map = {
    'LeetCode': { short: 'LC', dot: 'bg-amber-400', text: 'text-amber-400' },
    'GFG': { short: 'GFG', dot: 'bg-emerald-400', text: 'text-emerald-400' },
    'Codeforces': { short: 'CF', dot: 'bg-blue-500', text: 'text-blue-500' },
    'HackerRank': { short: 'HR', dot: 'bg-green-500', text: 'text-green-500' },
    'CodeChef': { short: 'CC', dot: 'bg-orange-500', text: 'text-orange-500' }
  };
  return map[name] || { short: name.substring(0, 2).toUpperCase(), dot: 'bg-slate-400', text: 'text-slate-400' };
};

const getRealUrl = (problemName, platformName, currentUrl) => {
  if (currentUrl && currentUrl !== '#' && currentUrl.trim() !== '') return currentUrl;
  
  const seedUrls = {
    'Number of Islands': {
      'LeetCode': 'https://leetcode.com/problems/number-of-islands/',
      'GFG': 'https://www.geeksforgeeks.org/problems/find-the-number-of-islands/1'
    },
    'Coin Change': {
      'LeetCode': 'https://leetcode.com/problems/coin-change/'
    },
    'Merge K Sorted Lists': {
      'LeetCode': 'https://leetcode.com/problems/merge-k-sorted-lists/'
    },
    'Two Sum': {
      'LeetCode': 'https://leetcode.com/problems/two-sum/'
    },
    'LRU Cache': {
      'LeetCode': 'https://leetcode.com/problems/lru-cache/',
      'GFG': 'https://www.geeksforgeeks.org/problems/lru-cache/1'
    },
    'Valid Parentheses': {
      'LeetCode': 'https://leetcode.com/problems/valid-parentheses/'
    },
    'Median of Two Sorted Arrays': {
      'LeetCode': 'https://leetcode.com/problems/median-of-two-sorted-arrays/'
    },
    'Longest Palindromic Substring': {
      'LeetCode': 'https://leetcode.com/problems/longest-palindromic-substring/'
    },
    'Climbing Stairs': {
      'LeetCode': 'https://leetcode.com/problems/climbing-stairs/'
    },
    'Search in Rotated Sorted Array': {
      'LeetCode': 'https://leetcode.com/problems/search-in-rotated-sorted-array/'
    }
  };
  
  if (seedUrls[problemName] && seedUrls[problemName][platformName]) {
    return seedUrls[problemName][platformName];
  }
  
  const slug = problemName.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');
  if (platformName === 'LeetCode') {
    return `https://leetcode.com/problems/${slug}/`;
  }
  return `https://www.google.com/search?q=${encodeURIComponent(problemName + ' ' + platformName)}`;
};
const parseMd = (text) => {
  if (!text) return '';
  return text
    .replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')
    .replace(/\*(.*?)\*/g, '<em>$1</em>')
    .replace(/`(.*?)`/g, '<code class="bg-slate-800 text-sky-400 px-1 py-0.5 rounded text-xs font-mono">$1</code>')
    .replace(/```([\s\S]*?)```/g, '<pre class="bg-slate-950 border border-slate-800 p-3 rounded-lg overflow-x-auto my-2 text-xs font-mono text-emerald-400">$1</pre>')
    .replace(/## (.*)/g, '<h2 class="text-lg font-bold text-slate-200 mt-4 mb-2">$1</h2>')
    .replace(/- (.*)/g, '<li class="ml-4 list-disc">$1</li>')
    .replace(/\n/g, '<br/>');
};

// --- SEED DATA ---
const initialProblems = [
  { id: uid(), name: 'Number of Islands', diff: 'Medium', status: 'Solved', tags: ['Graphs', 'BFS', 'DFS'], collId: 'top150', starred: true, notes: '## Approach\nUse DFS or BFS to traverse the grid. Mark visited land cells to avoid double counting.\n\n**Time:** O(M*N) | **Space:** O(M*N)', platforms: [{platform: 'LeetCode', url: 'https://leetcode.com/problems/number-of-islands/'}, {platform: 'GFG', url: 'https://www.geeksforgeeks.org/problems/find-the-number-of-islands/1'}], date: addDays(today(), -1), interval: 3, nextRev: addDays(today(), 2), revCount: 1 },
  { id: uid(), name: 'Coin Change', diff: 'Medium', status: 'Solved', tags: ['Dynamic Programming'], collId: 'blind75', starred: true, notes: '## Approach\nBottom-up DP. Array of size `amount + 1` initialized to `amount + 1`.\n\n**Time:** O(S*n) | **Space:** O(S)', platforms: [{platform: 'LeetCode', url: 'https://leetcode.com/problems/coin-change/'}], date: addDays(today(), -2), interval: 3, nextRev: addDays(today(), 1), revCount: 2 },
  { id: uid(), name: 'Merge K Sorted Lists', diff: 'Hard', status: 'Solved', tags: ['Heap', 'Linked List'], collId: 'top150', starred: false, notes: '## Approach\nUse a min-heap to keep track of the smallest node among the k linked lists. Extract min and add the next node from that list to the heap.\n\n**Time:** O(N log k) | **Space:** O(k)', platforms: [{platform: 'LeetCode', url: 'https://leetcode.com/problems/merge-k-sorted-lists/'}], date: addDays(today(), -3), interval: 5, nextRev: addDays(today(), 2), revCount: 1 },
  { id: uid(), name: 'Two Sum', diff: 'Easy', status: 'Solved', tags: ['Array', 'Hash Table'], collId: 'blind75', starred: true, notes: '## Approach\nUse a hash map to store the difference between the target and the current element as you iterate.\n\n**Time:** O(n) | **Space:** O(n)', platforms: [{platform: 'LeetCode', url: 'https://leetcode.com/problems/two-sum/'}], date: addDays(today(), -5), interval: 14, nextRev: addDays(today(), 9), revCount: 4 },
  { id: uid(), name: 'LRU Cache', diff: 'Medium', status: 'Attempted', tags: ['Design', 'Linked List', 'Hash Table'], collId: '', starred: false, notes: '', platforms: [{platform: 'LeetCode', url: 'https://leetcode.com/problems/lru-cache/'}, {platform: 'GFG', url: 'https://www.geeksforgeeks.org/problems/lru-cache/1'}], date: today(), interval: 1, nextRev: addDays(today(), 1), revCount: 0 },
  { id: uid(), name: 'Valid Parentheses', diff: 'Easy', status: 'Solved', tags: ['String', 'Stack'], collId: 'blind75', starred: false, notes: '', platforms: [{platform: 'LeetCode', url: 'https://leetcode.com/problems/valid-parentheses/'}], date: addDays(today(), -10), interval: 30, nextRev: addDays(today(), 20), revCount: 5 },
  { id: uid(), name: 'Median of Two Sorted Arrays', diff: 'Hard', status: 'Revisit', tags: ['Array', 'Binary Search'], collId: 'top150', starred: true, notes: '', platforms: [{platform: 'LeetCode', url: 'https://leetcode.com/problems/median-of-two-sorted-arrays/'}], date: addDays(today(), -15), interval: 1, nextRev: today(), revCount: 1 },
  { id: uid(), name: 'Longest Palindromic Substring', diff: 'Medium', status: 'Solved', tags: ['String', 'Dynamic Programming'], collId: '', starred: false, notes: '', platforms: [{platform: 'LeetCode', url: 'https://leetcode.com/problems/longest-palindromic-substring/'}], date: addDays(today(), -20), interval: 14, nextRev: addDays(today(), -1), revCount: 3 },
  { id: uid(), name: 'Climbing Stairs', diff: 'Easy', status: 'Solved', tags: ['Math', 'Dynamic Programming'], collId: 'blind75', starred: false, notes: '', platforms: [{platform: 'LeetCode', url: 'https://leetcode.com/problems/climbing-stairs/'}], date: addDays(today(), -4), interval: 7, nextRev: addDays(today(), 3), revCount: 1 },
  { id: uid(), name: 'Search in Rotated Sorted Array', diff: 'Medium', status: 'Solved', tags: ['Array', 'Binary Search'], collId: 'blind75', starred: false, notes: '', platforms: [{platform: 'LeetCode', url: 'https://leetcode.com/problems/search-in-rotated-sorted-array/'}], date: addDays(today(), -2), interval: 3, nextRev: addDays(today(), 1), revCount: 2 }
];

const initialActivity = {
  [today()]: 2, [addDays(today(), -1)]: 1, [addDays(today(), -2)]: 3, 
  [addDays(today(), -4)]: 1, [addDays(today(), -5)]: 4, [addDays(today(), -7)]: 2, 
  [addDays(today(), -10)]: 1, [addDays(today(), -15)]: 5, [addDays(today(), -20)]: 2, 
  [addDays(today(), -25)]: 3
};

// --- MAIN APP COMPONENT ---
export default function App() {
  // --- STATE ---
  const [user, setUser] = useState(() => JSON.parse(localStorage.getItem('dsa_session') || 'null'));
  const [problems, setProblems] = useState([]);
  const [collections, setCollections] = useState([]);
  const [trash, setTrash] = useState([]);
  const [activity, setActivity] = useState({});

  // UI selection states
  const [selectedCollection, setSelectedCollection] = useState(null);
  const [selectedTopic, setSelectedTopic] = useState(null);

  const [view, setView] = useState('problems');
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [exportOpen, setExportOpen] = useState(false);
  
  // Modals & Forms
  const [authModal, setAuthModal] = useState(false);
  const [authMode, setAuthMode] = useState('login'); // 'login' or 'register'
  const [authError, setAuthError] = useState('');
  const [syncProgress, setSyncProgress] = useState(false);
  const [shortcutsModal, setShortcutsModal] = useState(false);
  const [remModal, setRemModal] = useState({ open: false, id: null });
  const [selectedInterval, setSelectedInterval] = useState(3);
  const [reviewTab, setReviewTab] = useState('dueToday');
  const [newCollColor, setNewCollColor] = useState('blue');
  const [collModal, setCollModal] = useState(false);
  const [noteModal, setNoteModal] = useState(null);
  const [confirmModal, setConfirmModal] = useState({ open: false, title: '', message: '', onConfirm: null });
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [detailModal, setDetailModal] = useState(null);
  
  // Add/Edit Problem State
  const [probModal, setProbModal] = useState({ open: false, id: null });
  const [probForm, setProbForm] = useState({ name: '', diff: 'Medium', status: 'Solved', tags: '', collId: '', starred: false, notes: '', platforms: [] });
  const [notesTab, setNotesTab] = useState('write');

  // Filters
  const [filters, setFilters] = useState({ search: '', diff: '', status: '', tag: '' });

  const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';
  const apiHeaders = () => ({
    'Content-Type': 'application/json',
    'Authorization': user && user.token ? `Bearer ${user.token}` : ''
  });

  const mapProblem = p => ({ ...p, id: p._id || p.id });

  // --- EFFECT: AUTO GUEST LOGIN ---
  useEffect(() => {
    if (!user) {
      fetch(`${API_URL}/auth/guest-login`, { method: 'POST' })
        .then(async res => {
          const data = await res.json();
          if (!res.ok) throw new Error(data.message);
          return data;
        })
        .then(data => {
          setUser({ username: data.user.username, name: data.user.name, token: data.token, isGuest: true });
        })
        .catch(err => console.error('Error logging in as guest:', err));
    }
  }, [user]);

  // --- EFFECT: SYNC/FETCH DATA FROM MONGO ---
  useEffect(() => {
    if (user && user.token) {
      const headers = { 'Authorization': `Bearer ${user.token}` };
      
      // Fetch problems
      fetch(`${API_URL}/problems`, { headers })
        .then(res => res.json())
        .then(data => setProblems(data.map(mapProblem)))
        .catch(err => console.error('Error fetching problems:', err));

      // Fetch trash
      fetch(`${API_URL}/problems/trash`, { headers })
        .then(res => res.json())
        .then(data => setTrash(data.map(mapProblem)))
        .catch(err => console.error('Error fetching trash:', err));

      // Fetch collections
      fetch(`${API_URL}/collections`, { headers })
        .then(res => res.json())
        .then(data => setCollections(data))
        .catch(err => console.error('Error fetching collections:', err));

      // Fetch goals (removed)

      // Fetch profile (for activity heatmap)
      fetch(`${API_URL}/auth/me`, { headers })
        .then(res => res.json())
        .then(data => {
          if (data.activity) {
            setActivity(data.activity);
          }
        })
        .catch(err => console.error('Error fetching profile:', err));
    }
  }, [user]);

  useEffect(() => {
    if (user) {
      localStorage.setItem('dsa_session', JSON.stringify(user));
    } else {
      localStorage.removeItem('dsa_session');
    }
  }, [user]);

  // Sync selectedInterval when next review modal opens
  useEffect(() => {
    if (remModal.id) {
      const p = problems.find(x => x.id === remModal.id);
      if (p) {
        setSelectedInterval(p.noRep ? -1 : (p.interval || 3));
      }
    }
  }, [remModal.id, problems]);

  // Keyboard Shortcuts
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.target.tagName === 'INPUT' || e.target.tagName === 'TEXTAREA' || e.target.tagName === 'SELECT') return;
      if (e.key === 'Escape') { setProbModal({open:false, id:null}); setRemModal({open:false, id:null}); setNoteModal(null); setShortcutsModal(false); }
      const key = e.key.toLowerCase();
      if (key === 'n') openAddModal();
      if (key === 'd') setView('dashboard');
      if (key === 'p') setView('problems');
      if (key === '?') setShortcutsModal(true);
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [problems, user]);

  // --- ACTIONS ---
  const logAct = () => {
    if (user && user.token) {
      fetch(`${API_URL}/auth/activity`, { method: 'POST', headers: apiHeaders() })
        .then(res => res.json())
        .then(newAct => setActivity(newAct))
        .catch(err => console.error(err));
    } else {
      setActivity(prev => ({ ...prev, [today()]: (prev[today()] || 0) + 1 }));
    }
  };

  const openAddModal = (id = null) => {
    if (id) {
      const p = problems.find(x => x.id === id);
      setProbForm({ ...p, tags: p.tags.join(', '), platforms: p.platforms || [] });
    } else {
      setProbForm({ name: '', diff: 'Medium', status: 'Solved', tags: '', collId: '', starred: false, notes: '', platforms: [] });
    }
    setNotesTab('write');
    setProbModal({ open: true, id });
  };

  const saveProblem = (e) => {
    e.preventDefault();
    if (!probForm.name) return;
    
    const data = {
      ...probForm,
      tags: probForm.tags.split(',').map(t => t.trim()).filter(Boolean),
      platforms: probForm.platforms.filter(pl => pl.platform && pl.url.trim() !== '')
    };

    if (probModal.id) {
      if (user && user.token) {
        fetch(`${API_URL}/problems/${probModal.id}`, {
          method: 'PUT',
          headers: apiHeaders(),
          body: JSON.stringify(data)
        })
        .then(res => res.json())
        .then(updated => {
          setProblems(probs => probs.map(x => x.id === probModal.id ? mapProblem(updated) : x));
        })
        .catch(err => console.error(err));
      } else {
        setProblems(probs => probs.map(p => p.id === probModal.id ? { ...p, ...data } : p));
      }
    } else {
      const payload = {
        ...data,
        date: today(),
        interval: data.status === 'Solved' ? 3 : 1,
        nextRev: addDays(today(), data.status === 'Solved' ? 3 : 1),
        revCount: 0
      };
      if (user && user.token) {
        fetch(`${API_URL}/problems`, {
          method: 'POST',
          headers: apiHeaders(),
          body: JSON.stringify(payload)
        })
        .then(res => res.json())
        .then(newProb => {
          setProblems(probs => [mapProblem(newProb), ...probs]);
          logAct();
        })
        .catch(err => console.error(err));
      } else {
        setProblems(probs => [{ id: uid(), ...payload }, ...probs]);
        logAct();
      }
    }
    setProbModal({ open: false, id: null });
  };

  const deleteProblem = (id) => {
    const p = problems.find(x => x.id === id);
    if (!p) return;
    setConfirmModal({
      open: true,
      title: 'Move to Recycle Bin?',
      message: `Are you sure you want to move "${p.name}" to the Recycle Bin?`,
      onConfirm: () => {
        if (user && user.token) {
          fetch(`${API_URL}/problems/${p._id || p.id}/trash`, {
            method: 'PUT',
            headers: apiHeaders(),
            body: JSON.stringify({ isDeleted: true, delDate: today() })
          })
          .then(res => res.json())
          .then(updated => {
            setProblems(probs => probs.filter(x => x.id !== id));
            setTrash(t => [mapProblem(updated), ...t]);
          })
          .catch(err => console.error(err));
        } else {
          setProblems(probs => probs.filter(x => x.id !== id));
          setTrash(t => [{ ...p, delDate: today() }, ...t]);
        }
      }
    });
  };

  const restoreProblem = (id) => {
    const p = trash.find(x => x.id === id);
    if (user && user.token) {
      fetch(`${API_URL}/problems/${p._id || p.id}/trash`, {
        method: 'PUT',
        headers: apiHeaders(),
        body: JSON.stringify({ isDeleted: false })
      })
      .then(res => res.json())
      .then(updated => {
        setTrash(t => t.filter(x => x.id !== id));
        setProblems(probs => [mapProblem(updated), ...probs]);
      })
      .catch(err => console.error(err));
    } else {
      setTrash(t => t.filter(x => x.id !== id));
      setProblems(probs => [{ ...p, delDate: null }, ...probs]);
    }
  };

  const deletePermanent = (id) => {
    const p = trash.find(x => x.id === id);
    if (!p) return;
    setConfirmModal({
      open: true,
      title: 'Delete Permanently?',
      message: `This action cannot be undone. Are you sure you want to delete "${p.name}" forever?`,
      onConfirm: () => {
        if (user && user.token) {
          fetch(`${API_URL}/problems/${p._id || p.id}`, {
            method: 'DELETE',
            headers: apiHeaders()
          })
          .then(() => {
            setTrash(t => t.filter(x => x.id !== id));
          })
          .catch(err => console.error(err));
        } else {
          setTrash(t => t.filter(x => x.id !== id));
        }
      }
    });
  };

  const emptyTrash = () => {
    setConfirmModal({
      open: true,
      title: 'Empty Recycle Bin?',
      message: 'All items currently in the Recycle Bin will be permanently deleted. This action is irreversible.',
      onConfirm: () => {
        if (user && user.token) {
          fetch(`${API_URL}/problems/trash/empty`, {
            method: 'DELETE',
            headers: apiHeaders()
          })
          .then(() => setTrash([]))
          .catch(err => console.error(err));
        } else {
          setTrash([]);
        }
      }
    });
  };

  const markReviewed = (id) => {
    const p = problems.find(x => x.id === id);
    const updatedRevCount = p.revCount + 1;
    if (user && user.token) {
      fetch(`${API_URL}/problems/${p._id || p.id}`, {
        method: 'PUT',
        headers: apiHeaders(),
        body: JSON.stringify({ revCount: updatedRevCount })
      })
      .then(res => res.json())
      .then(updated => {
        setProblems(probs => probs.map(x => x.id === id ? mapProblem(updated) : x));
        logAct();
        setRemModal({ open: true, id });
      })
      .catch(err => console.error(err));
    } else {
      setProblems(probs => probs.map(p => p.id === id ? { ...p, revCount: p.revCount + 1 } : p));
      logAct(); setRemModal({ open: true, id });
    }
  };

  const setReminder = (days) => {
    const p = problems.find(x => x.id === remModal.id);
    const payload = {
      noRep: days === -1,
      interval: days !== -1 ? days : p.interval,
      nextRev: days !== -1 ? addDays(today(), days) : null
    };
    if (user && user.token) {
      fetch(`${API_URL}/problems/${p._id || p.id}`, {
        method: 'PUT',
        headers: apiHeaders(),
        body: JSON.stringify(payload)
      })
      .then(res => res.json())
      .then(updated => {
        setProblems(probs => probs.map(x => x.id === remModal.id ? mapProblem(updated) : x));
        setRemModal({ open: false, id: null });
      })
      .catch(err => console.error(err));
    } else {
      setProblems(probs => probs.map(p => p.id === remModal.id ? {
        ...p, noRep: days === -1, interval: days !== -1 ? days : p.interval, nextRev: days !== -1 ? addDays(today(), days) : null
      } : p));
      setRemModal({ open: false, id: null });
    }
  };

  const toggleStar = (id) => {
    const p = problems.find(x => x.id === id);
    const starredState = !p.starred;
    if (user && user.token) {
      fetch(`${API_URL}/problems/${p._id || p.id}`, {
        method: 'PUT',
        headers: apiHeaders(),
        body: JSON.stringify({ starred: starredState })
      })
      .then(res => res.json())
      .then(updated => {
        setProblems(probs => probs.map(x => x.id === id ? mapProblem(updated) : x));
      })
      .catch(err => console.error(err));
    } else {
      setProblems(probs => probs.map(p => p.id === id ? { ...p, starred: !p.starred } : p));
    }
  };

  // updateGoals (removed)

  const exportJSON = () => {
    const data = { problems, collections, trash, activity };
    const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a'); a.href = url; a.download = 'dsa_tracker_export.json'; a.click();
  };

  const exportCSV = () => {
    const headers = ['Name', 'Difficulty', 'Status', 'Tags', 'Date', 'Next Review', 'Reviews', 'Starred'];
    const rows = problems.map(p => [
      `"${p.name.replace(/"/g, '""')}"`, p.diff, p.status, `"${p.tags.join(', ')}"`, p.date, p.nextRev || '', p.revCount, p.starred
    ]);
    const csv = [headers.join(','), ...rows.map(r => r.join(','))].join('\n');
    const blob = new Blob([csv], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a'); a.href = url; a.download = 'dsa_tracker_export.csv'; a.click();
  };

  const insertFormatting = (before, after = '') => {
    const ta = document.getElementById('notes-editor');
    if (!ta) return;
    const start = ta.selectionStart;
    const end = ta.selectionEnd;
    const text = probForm.notes;
    const newText = text.substring(0, start) + before + text.substring(start, end) + after + text.substring(end);
    setProbForm({ ...probForm, notes: newText });
    setTimeout(() => {
      ta.focus();
      ta.setSelectionRange(start + before.length, end + before.length);
    }, 0);
  };

  const handleAuth = (e) => {
    e.preventDefault();
    const fd = new FormData(e.target);
    const username = fd.get('username');
    const password = fd.get('password');
    const name = fd.get('name') || username;

    const url = authMode === 'register' ? `${API_URL}/auth/register` : `${API_URL}/auth/login`;
    const body = authMode === 'register' ? { username, password, name } : { username, password };

    fetch(url, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(body)
    })
    .then(async res => {
      const data = await res.json();
      if (!res.ok) throw new Error(data.message || 'Authentication failed');
      return data;
    })
    .then(data => {
      const newUser = { username: data.user.username, name: data.user.name, token: data.token };
      localStorage.setItem('dsa_session', JSON.stringify(newUser));
      
      if (syncProgress) {
        return fetch(`${API_URL}/auth/sync`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${data.token}`
          }
        })
        .then(async sres => {
          if (!sres.ok) {
            const sdata = await sres.json();
            throw new Error(sdata.message || 'Data sync failed');
          }
          setUser(newUser);
          setAuthModal(false);
          setAuthError('');
          setSyncProgress(false);
        });
      } else {
        setUser(newUser);
        setAuthModal(false);
        setAuthError('');
      }
    })
    .catch(err => {
      setAuthError(err.message);
    });
  };

  const handleLogout = () => {
    localStorage.removeItem('dsa_session');
    setUser(null);
    setSelectedCollection(null);
    setSelectedTopic(null);
    setView('problems');
  };

  // --- COMPUTED DATA ---
  const solved = problems.filter(p => p.status === 'Solved');
  const due = solved.filter(p => p.nextRev <= today() && !p.noRep).sort((a,b) => new Date(a.nextRev) - new Date(b.nextRev));
  const dueToday = solved.filter(p => p.nextRev === today() && !p.noRep).sort((a,b) => new Date(a.nextRev) - new Date(b.nextRev));
  const overDue = solved.filter(p => p.nextRev < today() && !p.noRep).sort((a,b) => new Date(a.nextRev) - new Date(b.nextRev));
  const upcoming = solved.filter(p => p.nextRev > today() && p.nextRev <= addDays(today(), 7) && !p.noRep).sort((a,b) => new Date(a.nextRev) - new Date(b.nextRev));
  const allUpcoming = solved.filter(p => p.nextRev > today() && !p.noRep).sort((a,b) => new Date(a.nextRev) - new Date(b.nextRev));
  const diffCounts = { Easy: solved.filter(p => p.diff === 'Easy').length, Medium: solved.filter(p => p.diff === 'Medium').length, Hard: solved.filter(p => p.diff === 'Hard').length };
  
  const filteredProblems = useMemo(() => {
    return problems.filter(p => 
      (!filters.search || p.name.toLowerCase().includes(filters.search.toLowerCase())) &&
      (!filters.diff || p.diff === filters.diff) &&
      (!filters.status || p.status === filters.status) &&
      (!filters.tag || p.tags.includes(filters.tag))
    );
  }, [problems, filters]);

  // Last Activity Date Logic
  const sortedActDates = Object.keys(activity).sort((a, b) => new Date(b) - new Date(a));
  const lastActiveDate = sortedActDates.length > 0 ? sortedActDates[0] : 'Never';

  // --- SUB-COMPONENTS ---
  const NavItem = ({ id, icon: Icon, label, alert }) => (
    <button
      onClick={() => { setView(id); setSidebarOpen(false); }}
      className={`w-full flex items-center rounded-lg text-sm font-medium transition-colors relative ${
        sidebarCollapsed ? 'justify-center p-3' : 'gap-3 px-4 py-3'
      } ${view === id ? 'bg-sky-500/10 text-sky-400' : 'text-slate-400 hover:bg-slate-800 hover:text-slate-200'}`}
      title={sidebarCollapsed ? label : undefined}
    >
      <Icon size={18} />
      {!sidebarCollapsed && <span>{label}</span>}
      {alert > 0 && (
        sidebarCollapsed ? (
          <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-rose-500 rounded-full" />
        ) : (
          <span className="ml-auto bg-rose-500/20 text-rose-400 px-2 py-0.5 rounded-full text-[10px] font-bold">{alert}</span>
        )
      )}
    </button>
  );

  const Badge = ({ children, color }) => {
    const colors = { green: 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20', yellow: 'bg-amber-500/10 text-amber-400 border-amber-500/20', red: 'bg-rose-500/10 text-rose-400 border-rose-500/20', blue: 'bg-sky-500/10 text-sky-400 border-sky-500/20' };
    return <span className={`px-2 py-1 border rounded-md text-[10px] font-mono whitespace-nowrap uppercase tracking-wider ${colors[color] || colors.blue}`}>{children}</span>;
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-200 font-sans flex overflow-hidden">
      {/* --- SIDEBAR --- */}
      <aside className={`fixed inset-y-0 left-0 z-40 bg-slate-900 border-r border-slate-800 transform transition-all duration-300 ease-in-out md:translate-x-0 md:relative ${
        sidebarCollapsed ? 'w-20' : 'w-60'
      } ${sidebarOpen ? 'translate-x-0' : '-translate-x-full'}`}>
        <div className={`h-[73px] flex items-center border-b border-slate-800 transition-all duration-300 ${
          sidebarCollapsed ? 'justify-center px-2' : 'justify-between px-6'
        }`}>
          {sidebarCollapsed ? (
            <div className="text-lg font-bold text-sky-400 font-mono">&lt;/&gt;</div>
          ) : (
            <div>
              <h1 className="text-lg font-bold text-sky-400 font-mono">&lt;DSA Tracker/&gt;</h1>
              <p className="text-[10px] text-slate-500 mt-1 uppercase tracking-widest">{user && !user.isGuest ? user.name : 'GUEST MODE'}</p>
            </div>
          )}
          <button className="md:hidden text-slate-400" onClick={() => setSidebarOpen(false)}><X size={20} /></button>
        </div>
        <nav className="p-3 space-y-1 overflow-y-auto h-[calc(100vh-80px)] custom-scrollbar">
          <NavItem id="dashboard" icon={LayoutDashboard} label="Dashboard" />
          <NavItem id="problems" icon={ListTodo} label="Problem Log" />
          <NavItem id="review" icon={RotateCcw} label="Review Queue" alert={due.length} />
          <NavItem id="collections" icon={FolderHeart} label="Collections" />
          <NavItem id="topics" icon={Tags} label="Topics" />
          <NavItem id="notes" icon={BookOpen} label="Notes" />
          <div className="pt-4 mt-4 border-t border-slate-800">
            <NavItem id="trash" icon={Trash2} label="Recycle Bin" alert={trash.length} />
          </div>
        </nav>
      </aside>

      {/* --- MAIN CONTENT --- */}
      <main className="flex-1 flex flex-col min-w-0 h-screen overflow-hidden">
        {/* TOPBAR */}
        <header className="h-[73px] flex items-center justify-between px-4 md:px-6 bg-slate-900/80 backdrop-blur-md border-b border-slate-800 z-30">
          <div className="flex items-center gap-3">
            <button className="md:hidden text-slate-400 p-1" onClick={() => setSidebarOpen(true)}><Menu size={22} /></button>
            <button className="hidden md:flex text-slate-400 hover:text-slate-200 p-1.5 rounded-lg hover:bg-slate-800 transition-colors" onClick={() => setSidebarCollapsed(!sidebarCollapsed)} title={sidebarCollapsed ? "Expand sidebar" : "Collapse sidebar"}>
              <Menu size={20} />
            </button>
            <h2 className="text-lg font-bold capitalize hidden sm:block">{view.replace('-', ' ')}</h2>
          </div>
          <div className="flex items-center gap-2 md:gap-4">
            <button onClick={() => setShortcutsModal(true)} title="Shortcuts" className="hidden sm:flex text-slate-400 hover:text-slate-200 p-2 rounded-lg hover:bg-slate-800 transition-colors"><Keyboard size={18}/></button>
            
            <div className="relative">
              <button onClick={() => setExportOpen(!exportOpen)} className="flex items-center gap-2 text-sm text-slate-300 bg-slate-800/50 hover:bg-slate-800 px-3 py-2 rounded-lg transition-colors border border-slate-700/50"><Download size={16}/><span className="hidden sm:inline">Export</span><ChevronDown size={14} className={exportOpen ? 'rotate-180 transition-transform' : 'transition-transform'}/></button>
              {exportOpen && (
                <div className="absolute right-0 mt-2 w-32 bg-slate-800 border border-slate-700 rounded-lg shadow-xl overflow-hidden z-50">
                  <button onClick={() => { exportJSON(); setExportOpen(false); }} className="w-full text-left px-4 py-2.5 text-sm text-slate-200 hover:bg-slate-700 transition-colors">Export JSON</button>
                  <button onClick={() => { exportCSV(); setExportOpen(false); }} className="w-full text-left px-4 py-2.5 text-sm text-slate-200 hover:bg-slate-700 transition-colors">Export CSV</button>
                </div>
              )}
            </div>

            <button onClick={() => openAddModal()} className="bg-sky-500 hover:bg-sky-400 text-slate-950 font-bold px-3 py-2 md:px-4 md:py-2 rounded-lg text-sm flex items-center gap-2 transition-all shadow-[0_0_15px_rgba(56,189,248,0.3)] hover:shadow-[0_0_20px_rgba(56,189,248,0.5)]"><Plus size={16} /> <span className="hidden sm:inline">Add Problem</span></button>
            
            {(!user || user.isGuest) ? 
              <button onClick={() => setAuthModal(true)} className="flex items-center gap-2 text-sm text-sky-400 bg-sky-500/10 border border-sky-500/20 px-3 py-2 rounded-lg hover:bg-sky-500/20 transition-colors"><LogIn size={16}/> <span className="hidden sm:inline">Login / Register</span></button> :
              <button onClick={handleLogout} className="flex items-center gap-2 text-sm text-rose-400 bg-rose-500/10 border border-rose-500/20 px-3 py-2 rounded-lg hover:bg-rose-500/20 transition-colors"><LogOut size={16}/> <span className="hidden sm:inline">Logout</span></button>
            }
          </div>
        </header>

        {/* SCROLLABLE VIEW AREA */}
        <div className="flex-1 overflow-y-auto p-4 md:p-8">
          
          {/* VIEW: DASHBOARD */}
          {view === 'dashboard' && (
            <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <div className="bg-slate-900 p-5 rounded-xl border border-slate-800 border-t-sky-500 border-t-2"><p className="text-[10px] tracking-widest text-slate-400 uppercase font-mono">Total Solved</p><p className="text-3xl font-bold text-sky-400 mt-2">{solved.length}</p></div>
                <div className="bg-slate-900 p-5 rounded-xl border border-slate-800 border-t-emerald-500 border-t-2"><p className="text-[10px] tracking-widest text-slate-400 uppercase font-mono">Solved Today</p><p className="text-3xl font-bold text-emerald-400 mt-2">{problems.filter(p => p.date === today() && p.status === 'Solved').length}</p></div>
                <div className="bg-slate-900 p-5 rounded-xl border border-slate-800 border-t-amber-500 border-t-2"><p className="text-[10px] tracking-widest text-slate-400 uppercase font-mono">Due Reviews</p><p className="text-3xl font-bold text-amber-400 mt-2">{due.length}</p></div>
                <div className="bg-slate-900 p-5 rounded-xl border border-slate-800 border-t-purple-500 border-t-2"><p className="text-[10px] tracking-widest text-slate-400 uppercase font-mono">Total Logged</p><p className="text-3xl font-bold text-purple-400 mt-2">{problems.length}</p></div>
              </div>

              <div className="grid md:grid-cols-2 gap-6">
                {/* Left Column: Activity Heatmap */}
                {(() => {
                  const days = [];
                  for (let i = 89; i >= 0; i--) {
                    const d = addDays(today(), -i);
                    days.push({ date: d, count: activity[d] || 0 });
                  }
                  return (
                    <div className="bg-slate-900 border border-slate-800 p-6 rounded-xl shadow-xl flex flex-col justify-between">
                      <div>
                        <h3 className="font-semibold mb-4 text-slate-200 flex items-center gap-2">
                          <Activity size={18} className="text-emerald-400" />
                          Activity Heatmap (90 Days)
                        </h3>
                        <div className="overflow-x-auto pb-2 custom-scrollbar">
                          <div className="flex flex-col flex-wrap gap-1 h-[108px]" style={{ alignContent: 'flex-start' }}>
                            {days.map(d => (
                              <div
                                key={d.date}
                                title={`${d.date}: ${d.count} submissions`}
                                className={`w-3 h-3 rounded-[2px] transition-transform hover:scale-125 hover:z-10 ${
                                  d.count === 0
                                    ? 'bg-slate-800/50'
                                    : d.count < 2
                                    ? 'bg-emerald-500/40'
                                    : d.count < 4
                                    ? 'bg-emerald-500/70'
                                    : 'bg-emerald-400 shadow-[0_0_8px_rgba(16,185,129,0.6)]'
                                }`}
                              ></div>
                            ))}
                          </div>
                        </div>
                      </div>
                      <div className="flex items-center gap-2 mt-4 text-[10px] font-mono text-slate-500 justify-end">
                        <span>Less</span>
                        <div className="w-2.5 h-2.5 rounded-[2px] bg-slate-800/50"></div>
                        <div className="w-2.5 h-2.5 rounded-[2px] bg-emerald-500/40"></div>
                        <div className="w-2.5 h-2.5 rounded-[2px] bg-emerald-500/70"></div>
                        <div className="w-2.5 h-2.5 rounded-[2px] bg-emerald-400"></div>
                        <span>More</span>
                      </div>
                    </div>
                  );
                })()}

                {/* Right Column: Difficulty Distribution */}
                <div className="bg-slate-900 rounded-xl border border-slate-800 p-6 flex flex-col justify-center shadow-xl">
                  <h3 className="font-semibold mb-6 text-slate-200 flex items-center gap-2">
                    <Target size={18} className="text-sky-400" />
                    Difficulty Distribution
                  </h3>
                  <div className="flex items-center gap-8 w-full justify-center">
                    <svg viewBox="0 0 36 36" className="w-32 h-32 drop-shadow-2xl">
                      <path d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831" fill="none" stroke="#1e293b" strokeWidth="3" />
                      {solved.length > 0 && (
                        <>
                          <path d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831" fill="none" stroke="#10b981" strokeWidth="3" strokeDasharray={`${(diffCounts.Easy/solved.length)*100}, 100`} />
                          <path d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831" fill="none" stroke="#f59e0b" strokeWidth="3" strokeDasharray={`${(diffCounts.Medium/solved.length)*100}, 100`} strokeDashoffset={`-${(diffCounts.Easy/solved.length)*100}`} />
                          <path d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831" fill="none" stroke="#ef4444" strokeWidth="3" strokeDasharray={`${(diffCounts.Hard/solved.length)*100}, 100`} strokeDashoffset={`-${((diffCounts.Easy+diffCounts.Medium)/solved.length)*100}`} />
                        </>
                      )}
                      <text x="18" y="20.5" className="text-sm font-bold" fill="currentColor" textAnchor="middle">{solved.length}</text>
                    </svg>
                    <div className="space-y-3 text-sm font-mono flex-1 max-w-[150px]">
                      <div className="flex items-center gap-3 bg-slate-950/50 px-3 py-1.5 rounded-md border border-slate-800"><span className="w-2.5 h-2.5 rounded-full bg-emerald-500 shadow-[0_0_8px_#10b981]"></span> <span className="text-slate-400 w-12">EASY</span> <span className="text-emerald-400 font-bold">{diffCounts.Easy}</span></div>
                      <div className="flex items-center gap-3 bg-slate-950/50 px-3 py-1.5 rounded-md border border-slate-800"><span className="w-2.5 h-2.5 rounded-full bg-amber-500 shadow-[0_0_8px_#f59e0b]"></span> <span className="text-slate-400 w-12">MED</span> <span className="text-amber-400 font-bold">{diffCounts.Medium}</span></div>
                      <div className="flex items-center gap-3 bg-slate-950/50 px-3 py-1.5 rounded-md border border-slate-800"><span className="w-2.5 h-2.5 rounded-full bg-rose-500 shadow-[0_0_8px_#ef4444]"></span> <span className="text-slate-400 w-12">HARD</span> <span className="text-rose-400 font-bold">{diffCounts.Hard}</span></div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Row 3: Due & Upcoming Reviews side-by-side */}
              <div className="grid md:grid-cols-2 gap-6 w-full">
                {/* Due Review Card */}
                <div className="bg-slate-900 rounded-xl border border-slate-800 p-6 shadow-xl flex flex-col">
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="font-semibold text-slate-200 flex items-center gap-2">
                      <RotateCcw size={18} className="text-rose-400" />
                      Due Reviews ({due.length})
                    </h3>
                    <button onClick={() => { setView('review'); setReviewTab(overDue.length > 0 ? 'overDue' : 'dueToday'); }} className="text-xs text-sky-400 hover:text-sky-300 transition-colors font-medium flex items-center gap-1">view &rarr;</button>
                  </div>
                  <div className="space-y-2 max-h-[280px] overflow-y-auto pr-1 custom-scrollbar flex-1">
                    {due.length === 0 ? (
                      <p className="text-slate-500 text-sm font-mono border border-dashed border-slate-700/50 p-4 rounded-lg text-center">No reviews due. All caught up! 🎉</p>
                    ) : (
                      due.map(p => (
                        <div key={p.id} onClick={() => { setView('review'); setReviewTab(p.nextRev < today() ? 'overDue' : 'dueToday'); }} className="flex items-center justify-between p-3.5 bg-slate-950/50 rounded-lg border border-slate-800 cursor-pointer hover:border-rose-500/50 transition-colors">
                          <span className="font-medium text-sm truncate text-slate-300">{p.name}</span>
                          <Badge color="red">Due</Badge>
                        </div>
                      ))
                    )}
                  </div>
                </div>

                {/* Upcoming Review Card */}
                <div className="bg-slate-900 rounded-xl border border-slate-800 p-6 shadow-xl flex flex-col">
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="font-semibold text-slate-200 flex items-center gap-2">
                      <ListTodo size={18} className="text-amber-400" />
                      Upcoming Reviews (Next 7 Days) ({upcoming.length})
                    </h3>
                    <button onClick={() => { setView('review'); setReviewTab('upcoming'); }} className="text-xs text-sky-400 hover:text-sky-300 transition-colors font-medium flex items-center gap-1">view &rarr;</button>
                  </div>
                  <div className="space-y-2 max-h-[280px] overflow-y-auto pr-1 custom-scrollbar flex-1">
                    {upcoming.length === 0 ? (
                      <p className="text-slate-500 text-sm font-mono border border-dashed border-slate-700/50 p-4 rounded-lg text-center">No reviews in the next 7 days.</p>
                    ) : (
                      upcoming.map(p => (
                        <div key={p.id} onClick={() => { setView('review'); setReviewTab('upcoming'); }} className="flex items-center justify-between p-3.5 bg-slate-950/50 rounded-lg border border-slate-800 cursor-pointer hover:border-sky-500/50 transition-colors">
                          <span className="font-medium text-sm truncate text-slate-300">{p.name}</span>
                          <span className="text-[10px] font-mono text-amber-400">{formatDate(p.nextRev)}</span>
                        </div>
                      ))
                    )}
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* VIEW: PROBLEM LOG */}
          {view === 'problems' && (
            <div className="space-y-4 animate-in fade-in">
              <div className="grid grid-cols-1 md:grid-cols-4 gap-3 bg-slate-900 p-4 rounded-xl border border-slate-800 shadow-lg">
                <div className="flex items-center bg-slate-950 border border-slate-800 rounded-lg px-3 focus-within:border-sky-500 transition-colors">
                  <Search size={16} className="text-slate-500"/>
                  <input type="text" placeholder="Search problems..." className="bg-transparent border-none outline-none text-sm p-2.5 w-full text-slate-200" onChange={e => setFilters({...filters, search: e.target.value})} />
                </div>
                <select className="bg-slate-950 border border-slate-800 text-sm p-2.5 rounded-lg text-slate-300 outline-none focus:border-sky-500 transition-colors" onChange={e => setFilters({...filters, diff: e.target.value})}>
                  <option value="">All Difficulties</option><option>Easy</option><option>Medium</option><option>Hard</option>
                </select>
                <select className="bg-slate-950 border border-slate-800 text-sm p-2.5 rounded-lg text-slate-300 outline-none focus:border-sky-500 transition-colors" onChange={e => setFilters({...filters, status: e.target.value})}>
                  <option value="">All Statuses</option><option>Solved</option><option>Attempted</option><option>Revisit</option>
                </select>
                <button className="bg-slate-800 hover:bg-slate-700 text-slate-300 font-medium rounded-lg text-sm transition-colors border border-slate-700" onClick={() => setFilters({search: '', diff: '', status: '', tag: ''})}>Reset Filters</button>
              </div>

              <div className="bg-slate-900 border border-slate-800 rounded-xl overflow-x-auto shadow-xl">
                <table className="w-full text-left text-sm whitespace-nowrap">
                  <thead className="bg-slate-950/80 text-slate-500 font-mono text-[10px] uppercase tracking-widest border-b border-slate-800">
                    <tr>
                      <th className="p-4 rounded-tl-xl w-12 text-center">#</th>
                      <th className="p-4 w-10 text-center">Star</th>
                      <th className="p-4">Name</th>
                      <th className="p-4">Platforms</th>
                      <th className="p-4">Tags</th>
                      <th className="p-4">Diff</th>
                      <th className="p-4">Date</th>
                      <th className="p-4 text-center">Notes</th>
                      <th className="p-4 text-right rounded-tr-xl">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-800/50 text-slate-300">
                    {filteredProblems.length === 0 ? (
                      <tr>
                        <td colSpan="9" className="p-4">
                          <div className="p-12 text-center text-slate-500 font-mono border border-dashed border-slate-800 rounded-lg">
                            No problems found matching criteria.
                          </div>
                        </td>
                      </tr>
                    ) :
                      filteredProblems.map((p, index) => (
                      <tr key={p.id} className="hover:bg-slate-800/30 transition-colors group">
                        <td className="p-4 text-slate-600 font-mono text-xs text-center">
                          {String(index + 1).padStart(3, '0')}
                        </td>
                        <td className="p-4 text-center">
                          <button onClick={() => toggleStar(p.id)} className="focus:outline-none flex items-center justify-center w-full">
                            <Star size={16} className={`transition-colors ${p.starred ? 'text-amber-400 fill-amber-400 drop-shadow-[0_0_5px_rgba(251,146,60,0.5)]' : 'text-slate-600 hover:text-slate-400'}`} />
                          </button>
                        </td>
                        <td className="p-4">
                          <span className="font-bold text-slate-200 text-[15px]">{p.name}</span>
                          {p.collId && collections.find(c => c.id === p.collId) && (
                            <div className="flex items-center gap-1.5 mt-1.5">
                              <span className="bg-purple-500/10 text-purple-400 border border-purple-500/20 px-2 py-0.5 rounded flex items-center gap-1.5 text-[10px] font-bold tracking-widest"><FolderHeart size={10}/> {collections.find(c => c.id === p.collId).name}</span>
                            </div>
                          )}
                        </td>
                        <td className="p-4">
                          <div className="flex gap-2">
                            {p.platforms && p.platforms.map((pl, idx) => {
                              const info = getPlatformInfo(pl.platform);
                              return (
                                <a key={idx} href={getRealUrl(p.name, pl.platform, pl.url)} target="_blank" rel="noreferrer" className={`flex items-center gap-1.5 text-[10px] font-bold px-2 py-1 rounded-md border border-slate-700/50 bg-slate-800/50 hover:bg-slate-800 transition-colors ${info.text}`}>
                                  <div className={`w-1.5 h-1.5 rounded-full ${info.dot}`}></div>
                                  {info.short}
                                </a>
                              );
                            })}
                          </div>
                        </td>
                        <td className="p-4">
                          <div className="flex flex-wrap gap-2">
                            {p.tags.map(t => <span key={t} className="text-[10px] font-bold tracking-wider bg-sky-500/10 text-sky-400 px-2.5 py-1 rounded-full border border-sky-500/20">{t}</span>)}
                          </div>
                        </td>
                        <td className="p-4">
                          <Badge color={p.diff === 'Easy' ? 'green' : p.diff === 'Medium' ? 'yellow' : 'red'}>
                            {p.diff === 'Easy' ? 'E' : p.diff === 'Medium' ? 'M' : 'H'}
                          </Badge>
                        </td>
                        <td className="p-4 font-mono text-xs text-slate-400">
                          {formatDate(p.date)}
                        </td>
                        <td className="p-4 text-center">
                          {p.notes ? (
                            <button
                              onClick={() => setNoteModal(p)}
                              className="text-sky-400 font-mono text-xs flex items-center gap-1 justify-center hover:text-sky-300 transition-colors mx-auto"
                              title="Read Notes"
                            >
                              <BookOpen size={14}/> Yes
                            </button>
                          ) : (
                            <span className="text-slate-600 font-mono text-xs">-</span>
                          )}
                        </td>
                        <td className="p-4 text-right">
                          <div className="flex justify-end gap-2">
                            <button onClick={() => setDetailModal(p)} className="p-2 text-slate-500 hover:text-sky-400 border border-slate-700 hover:border-sky-500/50 rounded-lg transition-all" title="View Details">
                              <Eye size={14} />
                            </button>
                            <button onClick={() => openAddModal(p.id)} className="p-2 text-slate-500 hover:text-amber-400 border border-slate-700 hover:border-amber-500/50 rounded-lg transition-all" title="Edit">
                              <Pencil size={14} />
                            </button>
                            <button onClick={() => deleteProblem(p.id)} className="p-2 text-slate-500 hover:text-rose-400 border border-slate-700 hover:border-rose-500/50 rounded-lg transition-all" title="Delete">
                              <Trash2 size={14} />
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* VIEW: REVIEW QUEUE */}
          {/* VIEW: REVIEW QUEUE */}
          {view === 'review' && (() => {
            const currentList = reviewTab === 'dueToday' ? dueToday : reviewTab === 'overDue' ? overDue : allUpcoming;
            const headingMap = {
              dueToday: { title: `${dueToday.length} Due Today`, emoji: '🧠', text: 'Spaced repetition queue. Complete these tasks today.' },
              overDue: { title: `${overDue.length} Overdue Reviews`, emoji: '🚨', text: 'Catch up on missed reviews to lock in your memory.' },
              upcoming: { title: `${allUpcoming.length} Upcoming Reviews`, emoji: '📅', text: 'Upcoming scheduled reviews. Stay ahead of your game.' }
            };
            const activeHeader = headingMap[reviewTab] || headingMap.dueToday;

            return (
              <div className="space-y-6 animate-in fade-in">
                <div className="bg-gradient-to-r from-slate-900 to-slate-900/60 border border-slate-800 rounded-xl p-6 flex items-center gap-5 shadow-2xl">
                  <span className="text-4xl drop-shadow-[0_0_15px_rgba(56,189,248,0.3)]">{activeHeader.emoji}</span>
                  <div>
                    <h2 className="text-xl font-bold text-slate-200">{activeHeader.title}</h2>
                    <p className="text-sm text-slate-400 mt-1">{activeHeader.text}</p>
                  </div>
                </div>

                {/* Sub Tab Navigation */}
                <div className="flex border-b border-slate-800 gap-6">
                  {[
                    { id: 'dueToday', label: 'Due Today', count: dueToday.length, activeColor: 'text-sky-400 border-sky-500', badgeColor: 'bg-sky-500/10 text-sky-400 border-sky-500/20' },
                    { id: 'overDue', label: 'Over Due', count: overDue.length, activeColor: 'text-rose-400 border-rose-500', badgeColor: 'bg-rose-500/10 text-rose-400 border-rose-500/20' },
                    { id: 'upcoming', label: 'Upcoming', count: allUpcoming.length, activeColor: 'text-amber-400 border-amber-500', badgeColor: 'bg-amber-500/10 text-amber-400 border-amber-500/20' }
                  ].map(t => {
                    const isActive = reviewTab === t.id;
                    return (
                      <button
                        key={t.id}
                        type="button"
                        onClick={() => setReviewTab(t.id)}
                        className={`pb-3 text-sm font-bold border-b-2 transition-all flex items-center gap-2 relative -mb-[2px] ${
                          isActive
                            ? `${t.activeColor} border-current`
                            : 'border-transparent text-slate-500 hover:text-slate-300'
                        }`}
                      >
                        {t.label}
                        <span className={`px-2 py-0.5 rounded-full text-xs font-mono border font-bold ${
                          isActive ? t.badgeColor : 'bg-slate-950/40 text-slate-600 border-slate-800/40'
                        }`}>
                          {t.count}
                        </span>
                      </button>
                    );
                  })}
                </div>

                <div className="space-y-4">
                  {currentList.length === 0 ? (
                    <div className="border border-dashed border-slate-800 rounded-xl p-12 text-center text-slate-500 font-mono bg-slate-900/10">
                      No questions in this section.
                    </div>
                  ) : (
                    currentList.map(p => (
                      <div key={p.id} className={`bg-slate-900 border rounded-xl p-5 flex flex-col md:flex-row gap-4 items-start md:items-center justify-between transition-all hover:shadow-lg ${
                        p.nextRev < today() ? 'border-rose-500/20 hover:border-rose-500/40' : p.nextRev === today() ? 'border-blue-500/20 hover:border-blue-500/40' : 'border-slate-800 hover:border-slate-700'
                      }`}>
                        <div>
                          <div className="flex items-center gap-3 mb-1">
                            <h3 className="text-lg font-bold text-slate-200">{p.name}</h3>
                            {p.nextRev < today() ? (
                              <Badge color="red">Overdue</Badge>
                            ) : p.nextRev === today() ? (
                              <Badge color="blue">Today</Badge>
                            ) : (
                              <Badge color="yellow">In {Math.ceil((new Date(p.nextRev) - new Date(today())) / (1000 * 60 * 60 * 24))} days</Badge>
                            )}
                          </div>
                          <p className="text-xs text-slate-400 font-mono mt-2">Level: <span className="text-slate-300">{p.revCount}</span> | Tags: <span className="text-sky-400/80">{p.tags.join(', ')}</span></p>
                        </div>
                        <div className="flex items-center gap-3 w-full md:w-auto">
                          {p.nextRev <= today() && (
                            <button onClick={() => markReviewed(p.id)} className="flex-1 md:flex-none bg-emerald-500/10 text-emerald-400 border border-emerald-500/30 px-5 py-2.5 rounded-lg text-sm font-bold hover:bg-emerald-500/20 transition-colors shadow-[0_0_10px_rgba(16,185,129,0.1)]">✓ Marked Done</button>
                          )}
                          <button onClick={() => setRemModal({ open: true, id: p.id })} className="flex-1 md:flex-none bg-slate-800 text-slate-300 border border-slate-700 px-5 py-2.5 rounded-lg text-sm font-bold hover:bg-slate-700 transition-colors">⏰ Change Date</button>
                        </div>
                      </div>
                    ))
                  )}
                </div>
              </div>
            );
          })()}

          {/* VIEW: TOPICS */}
          {view === 'topics' && (() => {
            const topicStats = {};
            problems.forEach(p => p.tags.forEach(t => {
              if (!topicStats[t]) topicStats[t] = { total: 0, Easy: 0, Medium: 0, Hard: 0 };
              topicStats[t].total += 1;
              topicStats[t][p.diff] = (topicStats[t][p.diff] || 0) + 1;
            }));
            const sortedTopics = Object.entries(topicStats).sort((a,b) => b[1].total - a[1].total);
            if (selectedTopic) {
              const list = problems.filter(p => p.tags.includes(selectedTopic));
              return (
                <div className="space-y-4">
                  <div className="flex items-center justify-between bg-slate-900 p-4 rounded-xl border border-slate-800">
                    <div>
                      <h3 className="text-lg font-bold text-slate-200">Topic: {selectedTopic}</h3>
                      <p className="text-sm text-slate-400">{list.length} problems</p>
                    </div>
                    <div className="flex items-center gap-2">
                      <button onClick={() => setSelectedTopic(null)} className="text-slate-400 bg-slate-800 px-3 py-2 rounded-lg">Back</button>
                    </div>
                  </div>
                  <div className="bg-slate-900 border border-slate-800 rounded-xl p-4">
                    {list.map(p => (
                      <div key={p.id} className="p-3 border-b last:border-b-0 border-slate-800 flex justify-between items-center">
                        <div>
                          <div className="font-bold text-slate-200">{p.name}</div>
                          <div className="text-xs text-slate-400">{p.diff} • {formatDate(p.date)}</div>
                        </div>
                        <div className="flex items-center gap-2">
                          <button onClick={() => openAddModal(p.id)} className="text-sky-400">Edit</button>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              );
            }
            return (
              <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-4 animate-in fade-in">
                {sortedTopics.length ? sortedTopics.map(([t, stats]) => (
                  <div key={t} onClick={() => setSelectedTopic(t)} className="bg-slate-900 border border-slate-800 p-5 rounded-xl hover:border-sky-500/50 transition-colors cursor-pointer group shadow-lg">
                    <h3 className="font-semibold text-slate-300 truncate group-hover:text-sky-400 transition-colors">{t}</h3>
                    <p className="text-sky-500 text-3xl font-black mt-3">{stats.total}</p>
                    <div className="flex gap-2 mt-3 text-[11px] font-mono text-slate-400">
                      <span className="text-emerald-400">E: {stats.Easy || 0}</span>
                      <span className="text-amber-400">M: {stats.Medium || 0}</span>
                      <span className="text-rose-400">H: {stats.Hard || 0}</span>
                    </div>
                    <p className="text-[10px] text-slate-500 uppercase font-mono tracking-widest mt-1">Problems</p>
                  </div>
                )) : <p className="text-slate-500 col-span-full border border-dashed border-slate-700 p-12 text-center rounded-xl font-mono">No topics added yet.</p>}
              </div>
            );
          })()}

          {/* VIEW: COLLECTIONS */}
          {view === 'collections' && (() => {
            if (selectedCollection) {
              const col = collections.find(x => x.id === selectedCollection);
              const list = col && col.id === 'starred' ? problems.filter(p => p.starred) : problems.filter(p => p.collId === selectedCollection);
              return (
                <div className="space-y-4">
                  <div className="flex items-center justify-between bg-slate-900 p-4 rounded-xl border border-slate-800">
                    <div>
                      <h3 className="text-lg font-bold text-slate-200">{col ? col.name : 'Collection'}</h3>
                      <p className="text-sm text-slate-400">{list.length} problems</p>
                    </div>
                    <div className="flex items-center gap-2">
                      <button onClick={() => setSelectedCollection(null)} className="text-slate-400 bg-slate-800 px-3 py-2 rounded-lg">Back</button>
                    </div>
                  </div>
                  <div className="bg-slate-900 border border-slate-800 rounded-xl overflow-x-auto shadow-xl">
                    <table className="w-full text-left text-sm whitespace-nowrap">
                      <thead className="bg-slate-950/80 text-slate-500 font-mono text-[10px] uppercase tracking-widest border-b border-slate-800">
                        <tr>
                          <th className="p-4 rounded-tl-xl">Name</th>
                          <th className="p-4">Platforms</th>
                          <th className="p-4">Tags</th>
                          <th className="p-4">Diff</th>
                          <th className="p-4">Status</th>
                          <th className="p-4 text-right rounded-tr-xl">Actions</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-slate-800/50 text-slate-300">
                        {list.length === 0 ? (
                          <tr>
                            <td colSpan="6" className="p-4">
                              <div className="p-12 text-center text-slate-500 font-mono border border-dashed border-slate-800 rounded-lg">
                                No problems in this collection.
                              </div>
                            </td>
                          </tr>
                        ) : (
                          list.map(p => (
                            <tr key={p.id} className="hover:bg-slate-800/30 transition-colors group">
                              <td className="p-4 font-bold text-slate-200 text-[15px] flex items-center gap-2">
                                <button onClick={() => toggleStar(p.id)} className="focus:outline-none">
                                  <Star size={16} className={`transition-colors ${p.starred ? 'text-amber-400 fill-amber-400 drop-shadow-[0_0_5px_rgba(251,146,60,0.5)]' : 'text-slate-600 hover:text-slate-400'}`} />
                                </button>
                                <span>{p.name}</span>
                              </td>
                              <td className="p-4">
                                <div className="flex gap-2">
                                  {p.platforms && p.platforms.map((pl, idx) => {
                                    const info = getPlatformInfo(pl.platform);
                                    return (
                                      <a key={idx} href={getRealUrl(p.name, pl.platform, pl.url)} target="_blank" rel="noreferrer" className={`flex items-center gap-1.5 text-[10px] font-bold px-2 py-1 rounded-md border border-slate-700/50 bg-slate-800/50 hover:bg-slate-800 transition-colors ${info.text}`}>
                                        <div className={`w-1.5 h-1.5 rounded-full ${info.dot}`}></div>
                                        {info.short}
                                      </a>
                                    );
                                  })}
                                </div>
                              </td>
                              <td className="p-4">
                                <div className="flex flex-wrap gap-2">
                                  {p.tags.map(t => <span key={t} className="text-[10px] font-bold tracking-wider bg-sky-500/10 text-sky-400 px-2.5 py-1 rounded-full border border-sky-500/20">{t}</span>)}
                                </div>
                              </td>
                              <td className="p-4">
                                <Badge color={p.diff === 'Easy' ? 'green' : p.diff === 'Medium' ? 'yellow' : 'red'}>{p.diff}</Badge>
                              </td>
                              <td className="p-4">
                                <Badge color={p.status === 'Solved' ? 'green' : p.status === 'Attempted' ? 'yellow' : 'red'}>{p.status}</Badge>
                              </td>
                              <td className="p-4 text-right">
                                <div className="flex justify-end gap-2">
                                  <button onClick={() => openAddModal(p.id)} className="p-2 text-slate-500 hover:text-sky-400 border border-slate-700 hover:border-sky-500/50 rounded-lg transition-all" title="Edit">
                                    <Pencil size={14} />
                                  </button>
                                  {col && col.id === 'starred' ? (
                                    <button onClick={() => toggleStar(p.id)} className="p-2 text-slate-500 hover:text-rose-400 border border-slate-700 hover:border-rose-500/50 rounded-lg transition-all" title="Unstar">
                                      <Trash2 size={14} />
                                    </button>
                                  ) : (
                                    <button
                                      onClick={() => {
                                        if (user && user.token) {
                                          fetch(`${API_URL}/problems/${p._id || p.id}`, {
                                            method: 'PUT',
                                            headers: apiHeaders(),
                                            body: JSON.stringify({ collId: '' })
                                          })
                                          .then(res => res.json())
                                          .then(updated => {
                                            setProblems(ps => ps.map(x => x.id === p.id ? mapProblem(updated) : x));
                                          })
                                          .catch(err => console.error(err));
                                        } else {
                                          setProblems(ps => ps.map(x => x.id === p.id ? { ...x, collId: '' } : x));
                                        }
                                      }}
                                      className="p-2 text-slate-500 hover:text-rose-400 border border-slate-700 hover:border-rose-500/50 rounded-lg transition-all"
                                      title="Remove from Collection"
                                    >
                                      <Trash2 size={14} />
                                    </button>
                                  )}
                                </div>
                              </td>
                            </tr>
                          ))
                        )}
                      </tbody>
                    </table>
                  </div>
                </div>
              );
            }

            return (
              <div className="space-y-6 animate-in fade-in">
                <div className="flex justify-between items-center bg-slate-900 p-6 rounded-xl border border-slate-800 shadow-lg">
                  <div>
                    <h2 className="text-lg font-bold text-slate-200">Study Collections</h2>
                    <p className="text-sm text-slate-400 mt-1">Group problems into curated lists.</p>
                  </div>
                  <button onClick={() => { setNewCollColor('blue'); setCollModal(true); }} className="bg-sky-500 text-slate-950 px-4 py-2 rounded-lg text-sm font-bold shadow-[0_0_15px_rgba(56,189,248,0.3)] hover:shadow-[0_0_20px_rgba(56,189,248,0.5)] transition-all">+ New List</button>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
                  {collections.length ? collections.map(c => {
                    const count = c.id === 'starred' ? problems.filter(p => p.starred).length : problems.filter(p => p.collId === c.id).length;
                    const colorMap = {
                      blue: 'from-sky-500 to-blue-500',
                      green: 'from-emerald-500 to-teal-500',
                      yellow: 'from-amber-400 to-yellow-500',
                      red: 'from-rose-500 to-red-500',
                      purple: 'from-violet-500 to-purple-600',
                      orange: 'from-orange-400 to-amber-500'
                    };
                    const gradient = colorMap[c.color] || colorMap.blue;
                    return (
                      <div key={c.id} onClick={() => setSelectedCollection(c.id)} className="bg-slate-900 border border-slate-800 p-6 rounded-xl flex flex-col justify-between group shadow-lg hover:border-slate-600 transition-colors relative overflow-hidden cursor-pointer">
                        <div className={`absolute top-0 left-0 w-full h-1 bg-gradient-to-r ${gradient} opacity-50 group-hover:opacity-100 transition-opacity`}></div>
                        <div>
                          <h3 className="text-xl font-bold text-slate-200 mb-1">{c.name}</h3>
                          <p className="text-sm font-mono text-sky-400">{count} problems</p>
                          {c.description && <p className="text-xs text-slate-400 mt-2 line-clamp-2">{c.description}</p>}
                        </div>
                        <div className="mt-6 flex justify-end">
                           {c.id !== 'starred' && <button onClick={(e) => {
                             e.stopPropagation();
                             setConfirmModal({
                               open: true,
                               title: 'Delete Collection?',
                               message: `Are you sure you want to delete the "${c.name}" collection? This will not delete the problems inside it.`,
                               onConfirm: () => {
                                 if (user && user.token) {
                                   fetch(`${API_URL}/collections/${c.id}`, {
                                     method: 'DELETE',
                                     headers: apiHeaders()
                                   })
                                   .then(() => {
                                     setCollections(cs => cs.filter(x => x.id !== c.id));
                                     setProblems(ps => ps.map(x => x.collId === c.id ? { ...x, collId: '' } : x));
                                   })
                                   .catch(err => console.error(err));
                                 } else {
                                   setCollections(cs => cs.filter(x => x.id !== c.id));
                                   setProblems(ps => ps.map(x => x.collId === c.id ? { ...x, collId: '' } : x));
                                 }
                               }
                             });
                           }} className="text-rose-400 bg-rose-500/10 hover:bg-rose-500/20 px-3 py-1.5 rounded-lg text-xs font-semibold transition-colors flex items-center gap-1"><Trash2 size={12}/> Delete</button>}
                        </div>
                      </div>
                    );
                  }) : <p className="text-slate-500 col-span-full border border-dashed border-slate-700 p-12 text-center rounded-xl font-mono">Create study lists like "Blind 75".</p>}
                </div>
              </div>
            );
          })()}

          {/* VIEW: NOTES */}
          {view === 'notes' && (
            <div className="space-y-6 animate-in fade-in">
               <div className="bg-slate-900 border border-slate-800 p-6 rounded-xl shadow-lg flex gap-4 items-center">
                 <BookOpen size={32} className="text-purple-400 drop-shadow-[0_0_10px_rgba(167,139,250,0.5)]"/>
                 <div>
                   <h2 className="text-xl font-bold text-slate-200">Knowledge Base</h2>
                   <p className="text-sm text-slate-400 mt-1">All your written approaches and notes.</p>
                 </div>
               </div>
               <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
                 {problems.filter(p => p.notes && p.notes.trim() !== '').length === 0 ? <p className="text-slate-500 col-span-full border border-dashed border-slate-700 p-12 text-center rounded-xl font-mono">No notes written yet. Add notes to problems to see them here.</p> :
                  problems.filter(p => p.notes && p.notes.trim() !== '').map(p => (
                   <div key={p.id} className="bg-slate-900 border border-slate-800 p-6 rounded-xl shadow-lg flex flex-col">
                     <div className="flex justify-between items-start mb-4 border-b border-slate-800 pb-3">
                       <h3 className="font-bold text-sky-400 text-lg">{p.name}</h3>
                       <Badge color={p.diff === 'Easy' ? 'green' : p.diff === 'Medium' ? 'yellow' : 'red'}>{p.diff}</Badge>
                     </div>
                     <div className="prose prose-invert prose-sm max-w-none text-slate-300 line-clamp-4 mb-4 flex-1 font-mono text-xs opacity-80" dangerouslySetInnerHTML={{ __html: parseMd(p.notes) }}></div>
                     <button onClick={() => setNoteModal(p)} className="self-start text-xs font-bold text-sky-400 bg-sky-500/10 px-4 py-2 rounded-lg hover:bg-sky-500/20 transition-colors">Read Full Note →</button>
                   </div>
                 ))}
               </div>
            </div>
          )}



          {/* VIEW: TRASH */}
          {view === 'trash' && (
            <div className="animate-in fade-in space-y-6">
              <div className="flex justify-between items-center bg-rose-500/10 border border-rose-500/20 p-6 rounded-xl shadow-lg">
                <div>
                  <h2 className="text-lg font-bold text-rose-400">Recycle Bin</h2>
                  <p className="text-sm text-rose-400/70 mt-1">Items remain here until permanently deleted.</p>
                </div>
                <button onClick={emptyTrash} className="bg-rose-500 hover:bg-rose-600 text-white px-4 py-2 rounded-lg text-sm font-bold transition-colors shadow-[0_0_15px_rgba(244,63,94,0.3)]">Empty Bin</button>
              </div>
              
              <div className="space-y-3">
                {trash.length === 0 ? (
                  <div className="flex flex-col items-center justify-center p-20 text-center border border-dashed border-slate-800 rounded-2xl bg-slate-900/10 min-h-[300px] animate-in fade-in">
                    <Recycle size={56} className="text-emerald-400/90 animate-pulse mb-6 drop-shadow-[0_0_15px_rgba(52,211,153,0.3)]" />
                    <h3 className="text-lg font-bold text-slate-300">Recycle Bin is empty.</h3>
                    <p className="text-sm text-slate-500 mt-2">Deleted problems will appear here.</p>
                  </div>
                ) : trash.map(t => (
                  <div key={t.id} className="flex flex-col md:flex-row justify-between p-5 bg-slate-900 border border-slate-800 rounded-xl shadow-md gap-4">
                    <div><span className="font-bold text-slate-300 text-lg line-through">{t.name}</span><p className="text-xs text-slate-500 font-mono mt-2">Deleted on: {t.delDate} | Difficulty: {t.diff}</p></div>
                    <div className="flex items-center gap-3">
                      <button onClick={() => restoreProblem(t.id)} className="text-sm font-bold bg-emerald-500/10 text-emerald-400 px-4 py-2 rounded-lg border border-emerald-500/20 hover:bg-emerald-500/20 transition-colors">Restore</button>
                      <button onClick={() => deletePermanent(t.id)} className="text-sm font-bold bg-rose-500/10 text-rose-400 px-4 py-2 rounded-lg border border-rose-500/20 hover:bg-rose-500/20 transition-colors">Delete Forever</button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

        </div>
      </main>

      {/* --- MODALS --- */}
      {/* Add Problem Modal (Fully Upgraded UI) */}
      {probModal.open && (
        <div className="fixed inset-0 bg-slate-950/90 backdrop-blur-md z-50 flex items-center justify-center p-4 animate-in fade-in slide-in-from-bottom-10">
          <div className="bg-slate-900 border border-slate-800 rounded-2xl w-full max-w-3xl max-h-[90vh] flex flex-col shadow-[0_0_50px_rgba(0,0,0,0.5)]">
            
            <div className="flex justify-between items-center p-6 border-b border-slate-800">
              <h2 className="text-2xl font-black text-sky-400 tracking-tight">{probModal.id ? 'Edit Problem' : 'Add Problem'}</h2>
              <button type="button" onClick={() => setProbModal({ open: false, id: null })} className="text-slate-500 hover:text-white bg-slate-800/50 p-2 rounded-lg transition-colors"><X size={20}/></button>
            </div>
            
            <form onSubmit={saveProblem} className="flex-1 overflow-y-auto p-6 space-y-6 custom-scrollbar">
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Basic Info */}
                <div className="space-y-4 col-span-full md:col-span-1">
                  <div><label className="text-[10px] font-mono tracking-widest text-slate-400 uppercase mb-1.5 block">Problem Name *</label><input value={probForm.name} onChange={e=>setProbForm({...probForm, name: e.target.value})} required placeholder="e.g. Valid Anagram" className="w-full bg-slate-950 border border-slate-800 p-3 rounded-xl text-slate-200 outline-none focus:border-sky-500 transition-colors" /></div>
                  <div className="grid grid-cols-2 gap-4">
                    <div><label className="text-[10px] font-mono tracking-widest text-slate-400 uppercase mb-1.5 block">Difficulty</label><select value={probForm.diff} onChange={e=>setProbForm({...probForm, diff: e.target.value})} className="w-full bg-slate-950 border border-slate-800 p-3 rounded-xl text-slate-200 outline-none focus:border-sky-500 transition-colors"><option>Easy</option><option>Medium</option><option>Hard</option></select></div>
                    <div><label className="text-[10px] font-mono tracking-widest text-slate-400 uppercase mb-1.5 block">Status</label><select value={probForm.status} onChange={e=>setProbForm({...probForm, status: e.target.value})} className="w-full bg-slate-950 border border-slate-800 p-3 rounded-xl text-slate-200 outline-none focus:border-sky-500 transition-colors"><option>Solved</option><option>Attempted</option><option>Revisit</option></select></div>
                  </div>
                  <div><label className="text-[10px] font-mono tracking-widest text-slate-400 uppercase mb-1.5 block">Tags (Comma separated) *</label><input value={probForm.tags} onChange={e=>setProbForm({...probForm, tags: e.target.value})} required placeholder="e.g. Arrays, Sorting, Hash Table" className="w-full bg-slate-950 border border-slate-800 p-3 rounded-xl text-slate-200 outline-none focus:border-sky-500 transition-colors font-mono text-sm" /></div>
                </div>

                {/* Lists and Platforms */}
                <div className="space-y-4 col-span-full md:col-span-1">
                  <div><label className="text-[10px] font-mono tracking-widest text-slate-400 uppercase mb-1.5 block">Collection</label><select value={probForm.collId} onChange={e=>setProbForm({...probForm, collId: e.target.value})} className="w-full bg-slate-950 border border-slate-800 p-3 rounded-xl text-slate-200 outline-none focus:border-sky-500 transition-colors"><option value="">None</option>{collections.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}</select></div>
                  
                  <div className="flex items-center justify-between bg-slate-950 border border-slate-800 p-4 rounded-xl">
                    <label className="text-sm font-bold text-slate-300 flex items-center gap-2 cursor-pointer" onClick={() => setProbForm({...probForm, starred: !probForm.starred})}><Star size={18} className={probForm.starred ? 'text-amber-400 fill-amber-400 drop-shadow-[0_0_8px_rgba(251,146,60,0.6)]' : 'text-slate-600'}/> Star / Bookmark</label>
                    <button type="button" onClick={() => setProbForm({...probForm, starred: !probForm.starred})} className={`w-12 h-6 rounded-full relative transition-colors duration-300 ${probForm.starred ? 'bg-amber-500' : 'bg-slate-800'}`}><span className={`absolute top-1 left-1 w-4 h-4 bg-white rounded-full transition-transform duration-300 ${probForm.starred ? 'translate-x-6' : 'translate-x-0'}`}></span></button>
                  </div>

                  <div>
                    <label className="text-[10px] font-mono tracking-widest text-slate-400 uppercase mb-1.5 block">Platform Links</label>
                    <div className="space-y-2 max-h-32 overflow-y-auto pr-2 custom-scrollbar">
                      {probForm.platforms.map((pl, idx) => (
                        <div key={idx} className="flex gap-2 animate-in slide-in-from-left-2">
                          <select className="w-1/3 bg-slate-950 border border-slate-800 p-2.5 rounded-lg text-slate-300 text-xs outline-none focus:border-sky-500 transition-colors" value={pl.platform} onChange={(e) => { const newP = [...probForm.platforms]; newP[idx].platform = e.target.value; setProbForm({...probForm, platforms: newP}); }}>
                            <option>LeetCode</option><option>GFG</option><option>Codeforces</option><option>HackerRank</option><option>CodeChef</option><option>Other</option>
                          </select>
                          <input placeholder="https://..." className="w-2/3 bg-slate-950 border border-slate-800 p-2.5 rounded-lg text-slate-300 text-xs outline-none focus:border-sky-500 transition-colors font-mono" value={pl.url} onChange={(e) => { const newP = [...probForm.platforms]; newP[idx].url = e.target.value; setProbForm({...probForm, platforms: newP}); }}/>
                          <button type="button" onClick={() => setProbForm({...probForm, platforms: probForm.platforms.filter((_, i) => i !== idx)})} className="p-2 text-rose-500 bg-rose-500/10 hover:bg-rose-500/20 rounded-lg transition-colors"><X size={16}/></button>
                        </div>
                      ))}
                      <button type="button" onClick={() => setProbForm({...probForm, platforms: [...probForm.platforms, {platform: 'LeetCode', url: ''}]})} className="w-full py-2.5 text-xs font-bold text-sky-400 bg-sky-500/10 rounded-lg hover:bg-sky-500/20 transition-colors border border-sky-500/20 border-dashed">+ Add Link</button>
                    </div>
                  </div>
                </div>

                {/* Notes Markdown Editor */}
                <div className="col-span-full mt-2 bg-[#121621] border border-slate-800 rounded-xl overflow-hidden shadow-inner">
                  <div className="p-3 bg-[#181d2b] border-b border-slate-800">
                    <div className="text-[10px] font-mono text-slate-500 tracking-widest mb-3 uppercase font-bold">Notes / Approach (Markdown Supported)</div>
                    
                    {/* Toolbar */}
                    <div className="flex gap-2 mb-4 flex-wrap">
                      <button type="button" onClick={()=>insertFormatting('**','**')} className="px-3 py-1.5 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded text-sm font-serif font-bold border border-slate-700 transition-colors">B</button>
                      <button type="button" onClick={()=>insertFormatting('*','*')} className="px-3 py-1.5 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded text-sm font-serif italic border border-slate-700 transition-colors">I</button>
                      <button type="button" onClick={()=>insertFormatting('`','`')} className="px-3 py-1.5 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded text-sm font-mono border border-slate-700 transition-colors">`code`</button>
                      <button type="button" onClick={()=>insertFormatting('`'+'``\n','\n`'+'``')} className="px-3 py-1.5 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded text-sm font-mono border border-slate-700 transition-colors">Block</button>
                      <button type="button" onClick={()=>insertFormatting('- ')} className="px-3 py-1.5 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded text-sm border border-slate-700 transition-colors flex items-center gap-1"><span className="text-xl leading-none -mt-1">•</span> List</button>
                      <button type="button" onClick={()=>insertFormatting('## ')} className="px-3 py-1.5 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded text-sm font-bold border border-slate-700 transition-colors">H2</button>
                      <button type="button" onClick={()=>insertFormatting('**Time:** O(n) | **Space:** O(1)')} className="px-3 py-1.5 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded text-sm font-bold border border-slate-700 transition-colors">T/S</button>
                    </div>

                    {/* Tabs */}
                    <div className="flex gap-6 border-b border-slate-800">
                      <button type="button" onClick={()=>setNotesTab('write')} className={`pb-2.5 text-sm font-bold border-b-2 transition-colors flex items-center gap-2 ${notesTab === 'write' ? 'border-sky-500 text-sky-400' : 'border-transparent text-slate-500 hover:text-slate-300'}`}>
                        <div className={`w-3 h-1 rounded-full ${notesTab === 'write' ? 'bg-sky-500' : 'bg-slate-600'}`}></div> Write
                      </button>
                      <button type="button" onClick={()=>setNotesTab('preview')} className={`pb-2.5 text-sm font-bold border-b-2 transition-colors flex items-center gap-2 ${notesTab === 'preview' ? 'border-slate-500 text-slate-300' : 'border-transparent text-slate-600 hover:text-slate-400'}`}>
                        <BookOpen size={14}/> Preview
                      </button>
                    </div>
                  </div>
                  
                  {/* Editor Area */}
                  <div className="p-4 h-56 overflow-y-auto custom-scrollbar bg-[#121621]">
                    {notesTab === 'write' ? (
                      <textarea id="notes-editor" value={probForm.notes} onChange={e => setProbForm({...probForm, notes: e.target.value})} className="w-full h-full bg-transparent resize-none outline-none text-[13px] text-slate-300 font-mono leading-relaxed placeholder-slate-700" placeholder="## Approach...&#10;Use **sliding window**..."></textarea>
                    ) : (
                      <div className="prose prose-invert prose-sm max-w-none text-slate-300 font-mono text-[13px] leading-relaxed" dangerouslySetInnerHTML={{ __html: parseMd(probForm.notes) || '<span class="text-slate-600 italic">Nothing to preview.</span>' }}></div>
                    )}
                  </div>
                </div>
              </div>
              
            </form>
            <div className="flex justify-end gap-4 p-6 border-t border-slate-800 bg-slate-900/50 rounded-b-2xl">
              <button type="button" onClick={() => setProbModal({ open: false, id: null })} className="px-6 py-2.5 text-sm font-bold text-slate-400 hover:text-white border border-slate-700 rounded-lg hover:bg-slate-800 transition-colors">Cancel</button>
              <button type="button" onClick={saveProblem} className="bg-sky-500 hover:bg-sky-400 text-slate-950 font-black px-8 py-2.5 rounded-lg text-sm transition-all shadow-[0_0_15px_rgba(56,189,248,0.4)]">Save Problem</button>
            </div>
          </div>
        </div>
      )}

      {/* Keyboard Shortcuts Modal */}
      {shortcutsModal && (
        <div className="fixed inset-0 bg-slate-950/80 backdrop-blur-sm z-50 flex items-center justify-center p-4 animate-in fade-in">
          <div className="bg-slate-900 border border-slate-800 p-8 rounded-2xl w-full max-w-md shadow-2xl">
             <div className="flex justify-between items-center mb-6 border-b border-slate-800 pb-4">
               <h2 className="text-xl font-bold text-sky-400 flex items-center gap-2"><Keyboard/> Keyboard Shortcuts</h2>
               <button onClick={() => setShortcutsModal(false)} className="text-slate-500 hover:text-white"><X size={20}/></button>
             </div>
             <div className="space-y-4">
                <div className="flex justify-between items-center pb-2 border-b border-slate-800/50"><span className="text-slate-300 font-medium text-sm">Add Problem Modal</span> <kbd className="bg-slate-800 border border-slate-700 px-3 py-1 rounded-md text-sky-400 font-mono font-bold text-xs shadow-inner">N</kbd></div>
                <div className="flex justify-between items-center pb-2 border-b border-slate-800/50"><span className="text-slate-300 font-medium text-sm">Go to Dashboard</span> <kbd className="bg-slate-800 border border-slate-700 px-3 py-1 rounded-md text-sky-400 font-mono font-bold text-xs shadow-inner">D</kbd></div>
                <div className="flex justify-between items-center pb-2 border-b border-slate-800/50"><span className="text-slate-300 font-medium text-sm">Go to Problem Log</span> <kbd className="bg-slate-800 border border-slate-700 px-3 py-1 rounded-md text-sky-400 font-mono font-bold text-xs shadow-inner">P</kbd></div>
                <div className="flex justify-between items-center pb-2 border-b border-slate-800/50"><span className="text-slate-300 font-medium text-sm">Close any Modal</span> <kbd className="bg-slate-800 border border-slate-700 px-3 py-1 rounded-md text-sky-400 font-mono font-bold text-xs shadow-inner">Esc</kbd></div>
                <div className="flex justify-between items-center"><span className="text-slate-300 font-medium text-sm">Show this Help</span> <kbd className="bg-slate-800 border border-slate-700 px-3 py-1 rounded-md text-sky-400 font-mono font-bold text-xs shadow-inner">?</kbd></div>
             </div>
          </div>
        </div>
      )}

      {/* Auth Modal */}
      {authModal && (
        <div className="fixed inset-0 bg-slate-950/80 backdrop-blur-sm z-50 flex items-center justify-center p-4 animate-in fade-in">
          <form onSubmit={handleAuth} className="bg-slate-900 border border-slate-800 p-8 rounded-2xl w-full max-w-sm shadow-2xl">
            <div className="text-center mb-6">
              <h1 className="text-3xl font-black text-sky-400 font-mono drop-shadow-[0_0_10px_rgba(56,189,248,0.5)] mb-2">&lt;DSA/&gt;</h1>
              <p className="text-xs text-slate-400 tracking-widest uppercase">Spaced Repetition Tracker</p>
            </div>
            
            {/* Tabs for Login / Register */}
            <div className="flex border border-slate-800 rounded-lg overflow-hidden mb-6 bg-slate-950">
              <button type="button" onClick={() => { setAuthMode('login'); setAuthError(''); }} className={`flex-1 py-2 text-xs font-bold transition-colors ${authMode === 'login' ? 'bg-sky-500 text-slate-950' : 'text-slate-400 hover:text-slate-200'}`}>LOGIN</button>
              <button type="button" onClick={() => { setAuthMode('register'); setAuthError(''); }} className={`flex-1 py-2 text-xs font-bold transition-colors ${authMode === 'register' ? 'bg-sky-500 text-slate-950' : 'text-slate-400 hover:text-slate-200'}`}>REGISTER</button>
            </div>

            {authError && (
              <div className="bg-rose-500/10 border border-rose-500/20 text-rose-400 p-3 rounded-lg text-xs font-mono text-center mb-4">{authError}</div>
            )}

            <div className="space-y-4 mb-6">
              {authMode === 'register' && (
                <input name="name" required placeholder="Full Name..." className="w-full bg-slate-950 border border-slate-800 p-3 rounded-xl text-slate-200 focus:border-sky-500 outline-none font-bold text-sm" />
              )}
              <input name="username" required placeholder="Username..." className="w-full bg-slate-950 border border-slate-800 p-3 rounded-xl text-slate-200 focus:border-sky-500 outline-none font-bold text-sm" />
              <input name="password" type="password" required placeholder="Password..." className="w-full bg-slate-950 border border-slate-800 p-3 rounded-xl text-slate-200 focus:border-sky-500 outline-none font-bold text-sm" />
            </div>

            {/* Sync Checkbox */}
            <div className="flex items-center gap-2 mb-6">
              <input type="checkbox" id="sync-check" checked={syncProgress} onChange={e => setSyncProgress(e.target.checked)} className="rounded border-slate-800 bg-slate-950 text-sky-500 focus:ring-sky-500" />
              <label htmlFor="sync-check" className="text-xs text-slate-400 cursor-pointer">Sync current guest progress to my account</label>
            </div>

            <div className="flex gap-3">
              <button type="button" onClick={() => setAuthModal(false)} className="flex-1 px-4 py-3 text-sm font-bold text-slate-400 hover:text-white bg-slate-800 rounded-xl transition-colors">Cancel</button>
              <button type="submit" className="flex-1 bg-sky-500 hover:bg-sky-400 text-slate-950 font-black px-4 py-3 rounded-xl transition-colors shadow-[0_0_15px_rgba(56,189,248,0.4)]">{authMode === 'login' ? 'Login' : 'Register'}</button>
            </div>
          </form>
        </div>
      )}

      {/* Reminder Modal */}
      {remModal.open && (() => {
        const p = problems.find(x => x.id === remModal.id);
        if (!p) return null;
        return (
          <div className="fixed inset-0 bg-slate-950/80 backdrop-blur-sm z-50 flex items-center justify-center p-4 animate-in fade-in">
            <div className="bg-[#121620] border border-slate-800 p-6 rounded-2xl w-full max-w-md shadow-[0_0_50px_rgba(0,0,0,0.5)]">
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-sm font-bold text-slate-200 tracking-wide font-mono flex items-center gap-1.5">
                  ⏰ Set Next Review Date
                </h2>
                <button onClick={() => setRemModal({ open: false, id: null })} className="text-slate-500 hover:text-white transition-colors">
                  <X size={20} />
                </button>
              </div>
              <div className="mb-6">
                <h3 className="text-lg font-bold text-slate-100 mb-1">{p.name}</h3>
                <p className="text-xs text-slate-400 font-medium">
                  <span className={p.diff === 'Easy' ? 'text-emerald-400' : p.diff === 'Medium' ? 'text-amber-400' : 'text-rose-400'}>{p.diff}</span>
                  {p.tags && p.tags.length > 0 && ` · ${p.tags.join(', ')}`}
                  {` · Reviewed ${p.revCount || 0}×`}
                </p>
              </div>
              <p className="text-[10px] font-mono tracking-widest text-slate-500 uppercase mb-3">When should you review this again?</p>
              <div className="flex flex-wrap gap-2 mb-6">
                {[1, 2, 3, 7, 14, 30, 60].map(d => {
                  const isSelected = selectedInterval === d;
                  return (
                    <button
                      key={d}
                      type="button"
                      onClick={() => setSelectedInterval(d)}
                      className={`px-3.5 py-2 rounded-lg text-xs font-semibold border transition-all ${
                        isSelected
                          ? 'bg-sky-500/10 border-sky-500 text-sky-400 font-bold'
                          : 'bg-slate-950/40 border-slate-800 text-slate-400 hover:border-slate-700 hover:text-slate-200'
                      }`}
                    >
                      {d} {d === 1 ? 'Day' : 'Days'}
                    </button>
                  );
                })}
                <button
                  type="button"
                  onClick={() => setSelectedInterval(-1)}
                  className={`px-3.5 py-2 rounded-lg text-xs font-semibold border transition-all flex items-center gap-1.5 ${
                    selectedInterval === -1
                      ? 'bg-rose-500/10 border-rose-500 text-rose-400 font-bold'
                      : 'bg-slate-950/40 border-slate-800 text-slate-400 hover:border-slate-700 hover:text-slate-200'
                  }`}
                >
                  🚫 Don't Repeat
                </button>
              </div>
              <div className="bg-slate-950/60 p-4 rounded-xl border border-slate-800/80 mb-6 text-xs font-mono">
                {selectedInterval === -1 ? (
                  <span className="text-rose-400 font-medium">No reviews scheduled (Don't Repeat)</span>
                ) : (
                  <span className="text-sky-400">
                    Next review: <span className="font-bold">{formatDate(addDays(today(), selectedInterval))}</span> (in {selectedInterval} {selectedInterval === 1 ? 'day' : 'days'})
                  </span>
                )}
              </div>
              <div className="flex justify-end gap-3 border-t border-slate-800/50 pt-5">
                <button
                  type="button"
                  onClick={() => setRemModal({ open: false, id: null })}
                  className="px-5 py-2.5 rounded-lg text-xs font-bold text-slate-400 border border-slate-800 hover:bg-slate-800 hover:text-slate-200 transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="button"
                  onClick={() => setReminder(selectedInterval)}
                  className="px-5 py-2.5 rounded-lg text-xs font-bold text-slate-950 bg-sky-500 hover:bg-sky-400 transition-colors flex items-center gap-1.5 shadow-[0_0_15px_rgba(56,189,248,0.3)]"
                >
                  ✓ Confirm
                </button>
              </div>
            </div>
          </div>
        );
      })()}

      {/* Collection Modal */}
      {collModal && (
        <div className="fixed inset-0 bg-slate-950/80 backdrop-blur-sm z-50 flex items-center justify-center p-4 animate-in fade-in">
          <form onSubmit={(e) => {
            e.preventDefault();
            const name = e.target.name.value;
            const description = e.target.description.value;
            const color = newCollColor;
            const id = uid();
            if (user && user.token) {
              fetch(`${API_URL}/collections`, {
                method: 'POST',
                headers: apiHeaders(),
                body: JSON.stringify({ id, name, description, color })
              })
              .then(res => res.json())
              .then(newColl => {
                setCollections([...collections, newColl]);
                setCollModal(false);
              })
              .catch(err => console.error(err));
            } else {
              setCollections([...collections, { id, name, description, color }]);
              setCollModal(false);
            }
          }} className="bg-[#121620] border border-slate-800 p-6 rounded-2xl w-full max-w-md shadow-[0_0_50px_rgba(0,0,0,0.5)] flex flex-col">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-lg font-bold text-slate-100 font-sans tracking-wide">New Collection</h2>
              <button type="button" onClick={() => setCollModal(false)} className="text-slate-500 hover:text-white transition-colors"><X size={20} /></button>
            </div>
            
            <div className="space-y-4 mb-6">
              <div>
                <label className="text-[10px] font-mono tracking-widest text-slate-500 uppercase mb-2 block">Collection Name *</label>
                <input name="name" required placeholder="e.g. Blind 75, Top Interview 150..." className="w-full bg-slate-950 border border-slate-800 p-3 rounded-lg text-slate-200 outline-none focus:border-sky-500 font-bold text-sm" />
              </div>
              <div>
                <label className="text-[10px] font-mono tracking-widest text-slate-500 uppercase mb-2 block">Description (Optional)</label>
                <input name="description" placeholder="Short description..." className="w-full bg-slate-950 border border-slate-800 p-3 rounded-lg text-slate-200 outline-none focus:border-sky-500 text-sm" />
              </div>
              <div>
                <label className="text-[10px] font-mono tracking-widest text-slate-500 uppercase mb-2 block">Color</label>
                <div className="flex gap-3 mt-2">
                  {['blue', 'green', 'yellow', 'red', 'purple', 'orange'].map(c => {
                    const bgClasses = {
                      blue: 'bg-sky-400',
                      green: 'bg-emerald-400',
                      yellow: 'bg-amber-400',
                      red: 'bg-rose-400',
                      purple: 'bg-violet-400',
                      orange: 'bg-orange-400'
                    };
                    const isSelected = newCollColor === c;
                    return (
                      <button
                        key={c}
                        type="button"
                        onClick={() => setNewCollColor(c)}
                        className={`w-6 h-6 rounded-full ${bgClasses[c]} transition-transform ${
                          isSelected ? 'ring-2 ring-offset-2 ring-offset-slate-900 ring-white scale-110 shadow-lg' : 'hover:scale-105'
                        }`}
                      />
                    );
                  })}
                </div>
              </div>
            </div>
            
            <div className="flex justify-end gap-3 border-t border-slate-800/50 pt-5">
              <button
                type="button"
                onClick={() => setCollModal(false)}
                className="px-5 py-2.5 rounded-lg text-xs font-bold text-slate-400 border border-slate-800 hover:bg-slate-800 hover:text-slate-200 transition-colors"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="px-5 py-2.5 rounded-lg text-xs font-bold text-slate-950 bg-sky-500 hover:bg-sky-400 transition-colors shadow-[0_0_15px_rgba(56,189,248,0.3)]"
              >
                Save
              </button>
            </div>
          </form>
        </div>
      )}

      {/* Notes View Modal */}
      {noteModal && (
        <div className="fixed inset-0 bg-slate-950/80 backdrop-blur-sm z-50 flex items-center justify-center p-4 animate-in fade-in">
          <div className="bg-[#121621] border border-slate-800 p-8 rounded-2xl w-full max-w-2xl max-h-[85vh] flex flex-col shadow-2xl">
            <div className="flex justify-between items-start mb-6 border-b border-slate-800 pb-4">
              <div>
                <h2 className="text-2xl font-bold text-sky-400">{noteModal.name}</h2>
                <div className="flex gap-2 mt-2">{noteModal.tags.map(t => <span key={t} className="text-[10px] uppercase tracking-widest font-mono text-slate-400 bg-slate-800 px-2 py-0.5 rounded">{t}</span>)}</div>
              </div>
              <button onClick={() => setNoteModal(null)} className="text-slate-500 hover:text-white bg-slate-800 p-2 rounded-lg"><X size={20}/></button>
            </div>
            <div className="overflow-y-auto custom-scrollbar pr-2 flex-1">
               <div className="prose prose-invert prose-sm max-w-none text-slate-300 font-mono text-sm leading-relaxed" dangerouslySetInnerHTML={{ __html: parseMd(noteModal.notes) || '<span class="text-slate-600 italic">No notes provided.</span>' }}></div>
            </div>
            <div className="mt-6 pt-4 border-t border-slate-800 flex justify-end">
               <button onClick={() => { setNoteModal(null); openAddModal(noteModal.id); }} className="bg-sky-500/10 text-sky-400 border border-sky-500/30 px-6 py-2 rounded-lg text-sm font-bold hover:bg-sky-500/20 transition-colors">Edit Notes</button>
            </div>
          </div>
        </div>
      )}

      {/* Confirmation Modal */}
      {confirmModal.open && (
        <div className="fixed inset-0 bg-slate-950/80 backdrop-blur-sm z-50 flex items-center justify-center p-4 animate-in fade-in">
          <div className="bg-[#121620] border border-slate-800 p-6 rounded-2xl w-full max-w-sm shadow-[0_0_50px_rgba(0,0,0,0.5)]">
            <h2 className="text-lg font-bold text-slate-100 mb-3">{confirmModal.title}</h2>
            <p className="text-sm text-slate-400 mb-6">{confirmModal.message}</p>
            <div className="flex justify-end gap-3">
              <button
                type="button"
                onClick={() => setConfirmModal({ open: false, title: '', message: '', onConfirm: null })}
                className="px-5 py-2.5 rounded-lg text-xs font-bold text-slate-400 border border-slate-800 hover:bg-slate-800 hover:text-slate-200 transition-colors"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={() => {
                  if (confirmModal.onConfirm) confirmModal.onConfirm();
                  setConfirmModal({ open: false, title: '', message: '', onConfirm: null });
                }}
                className="px-5 py-2.5 rounded-lg text-xs font-bold text-slate-950 bg-sky-500 hover:bg-sky-400 transition-colors shadow-[0_0_15px_rgba(56,189,248,0.3)]"
              >
                Confirm
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Detail Modal */}
      {detailModal && (
        <div className="fixed inset-0 bg-slate-950/80 backdrop-blur-sm z-50 flex items-center justify-center p-4 animate-in fade-in">
          <div className="bg-[#121620] border border-slate-800 p-8 rounded-2xl w-full max-w-2xl max-h-[85vh] flex flex-col shadow-2xl">
            <div className="flex justify-between items-start mb-6 border-b border-slate-800 pb-4">
              <div>
                <div className="flex items-center gap-3">
                  <h2 className="text-2xl font-bold text-slate-100">{detailModal.name}</h2>
                  <Badge color={detailModal.diff === 'Easy' ? 'green' : detailModal.diff === 'Medium' ? 'yellow' : 'red'}>
                    {detailModal.diff}
                  </Badge>
                  <Badge color={detailModal.status === 'Solved' ? 'green' : detailModal.status === 'Attempted' ? 'yellow' : 'red'}>
                    {detailModal.status}
                  </Badge>
                </div>
                {detailModal.collId && collections.find(c => c.id === detailModal.collId) && (
                  <p className="text-xs text-purple-400 font-bold mt-2 flex items-center gap-1.5">
                    <FolderHeart size={12}/> Collection: {collections.find(c => c.id === detailModal.collId).name}
                  </p>
                )}
              </div>
              <button onClick={() => setDetailModal(null)} className="text-slate-500 hover:text-white bg-slate-800/80 p-2 rounded-lg transition-colors">
                <X size={20} />
              </button>
            </div>
            
            <div className="overflow-y-auto custom-scrollbar pr-2 flex-1 space-y-6">
              {/* Problem Metadata Grid */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 bg-slate-950/40 p-4 rounded-xl border border-slate-800/60 font-mono text-xs">
                <div>
                  <span className="text-slate-500 uppercase tracking-wider block mb-1">Reviewed</span>
                  <span className="text-slate-200 font-bold">{detailModal.revCount || 0} times</span>
                </div>
                <div>
                  <span className="text-slate-500 uppercase tracking-wider block mb-1">Interval</span>
                  <span className="text-slate-200 font-bold">{detailModal.interval} days</span>
                </div>
                <div>
                  <span className="text-slate-500 uppercase tracking-wider block mb-1">Next Review</span>
                  <span className="text-sky-400 font-bold">{formatDate(detailModal.nextRev)}</span>
                </div>
                <div>
                  <span className="text-slate-500 uppercase tracking-wider block mb-1">Date Added</span>
                  <span className="text-slate-200 font-bold">{formatDate(detailModal.date)}</span>
                </div>
              </div>

              {/* Platforms */}
              {detailModal.platforms && detailModal.platforms.length > 0 && (
                <div>
                  <h3 className="text-xs font-mono tracking-widest text-slate-500 uppercase mb-3">Platforms</h3>
                  <div className="flex flex-wrap gap-2">
                    {detailModal.platforms.map((pl, idx) => {
                      const info = getPlatformInfo(pl.platform);
                      return (
                        <a key={idx} href={getRealUrl(detailModal.name, pl.platform, pl.url)} target="_blank" rel="noreferrer" className={`flex items-center gap-2 text-xs font-bold px-3 py-1.5 rounded-lg border border-slate-800 bg-slate-950/50 hover:bg-slate-800 transition-colors ${info.text}`}>
                          <div className={`w-2 h-2 rounded-full ${info.dot}`}></div>
                          {info.short} (Click to solve)
                        </a>
                      );
                    })}
                  </div>
                </div>
              )}

              {/* Tags */}
              {detailModal.tags && detailModal.tags.length > 0 && (
                <div>
                  <h3 className="text-xs font-mono tracking-widest text-slate-500 uppercase mb-3">Tags</h3>
                  <div className="flex flex-wrap gap-2">
                    {detailModal.tags.map(t => (
                      <span key={t} className="text-xs font-bold tracking-wider bg-sky-500/10 text-sky-400 px-3 py-1.5 rounded-full border border-sky-500/20">
                        {t}
                      </span>
                    ))}
                  </div>
                </div>
              )}

              {/* Notes */}
              <div>
                <h3 className="text-xs font-mono tracking-widest text-slate-500 uppercase mb-3">Notes</h3>
                <div className="bg-slate-950/60 border border-slate-800/80 p-5 rounded-xl prose prose-invert prose-sm max-w-none text-slate-300 font-mono text-sm leading-relaxed" dangerouslySetInnerHTML={{ __html: parseMd(detailModal.notes) || '<span class="text-slate-600 italic">No notes provided.</span>' }}></div>
              </div>
            </div>

            <div className="mt-6 pt-4 border-t border-slate-800/80 flex justify-end gap-3">
              <button
                onClick={() => { setDetailModal(null); openAddModal(detailModal.id); }}
                className="bg-amber-500/10 text-amber-400 border border-amber-500/20 px-5 py-2.5 rounded-lg text-xs font-bold hover:bg-amber-500/20 transition-colors flex items-center gap-1.5"
              >
                <Pencil size={14} /> Edit Problem
              </button>
              <button
                onClick={() => setDetailModal(null)}
                className="bg-slate-800 text-slate-200 border border-slate-700 px-5 py-2.5 rounded-lg text-xs font-bold hover:bg-slate-750 hover:text-white transition-colors"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
}