import { useState, useEffect } from 'react';
import { today, addDays } from '../utils/date.js';
import { uid } from '../utils/id.js';
import { fetchProfile, logActivity } from '../services/auth.service.js';
import {
  fetchProblems,
  fetchTrash,
  mapProblem,
  updateProblem,
  updateProblemTrash,
  deleteProblemPermanently,
  emptyTrash as emptyTrashRequest,
  createProblem,
} from '../services/problems.service.js';
import {
  fetchCollections,
  createCollection,
  deleteCollection as deleteCollectionRequest,
} from '../services/collections.service.js';

export default function useData(user) {
  const [problems, setProblems] = useState([]);
  const [collections, setCollections] = useState([]);
  const [trash, setTrash] = useState([]);
  const [activity, setActivity] = useState({});

  // Sync/fetch data from backend when user changes
  useEffect(() => {
    if (user && user.token) {
      fetchProblems(user.token)
        .then(data => setProblems(data.map(mapProblem)))
        .catch(err => console.error('Error fetching problems:', err));

      fetchTrash(user.token)
        .then(data => setTrash(data.map(mapProblem)))
        .catch(err => console.error('Error fetching trash:', err));

      fetchCollections(user.token)
        .then(data => setCollections(data))
        .catch(err => console.error('Error fetching collections:', err));

      fetchProfile(user.token)
        .then(data => {
          if (data.activity) {
            setActivity(data.activity);
          }
        })
        .catch(err => console.error('Error fetching profile:', err));
    } else {
      setProblems([]);
      setTrash([]);
      setCollections([]);
      setActivity({});
    }
  }, [user]);

  const logAct = () => {
    if (user && user.token) {
      logActivity(user.token)
        .then(newAct => setActivity(newAct))
        .catch(err => console.error(err));
    } else {
      setActivity(prev => ({ ...prev, [today()]: (prev[today()] || 0) + 1 }));
    }
  };

  const saveProblem = (probForm, probModalId) => {
    if (!probForm.name) return Promise.reject(new Error('Problem name is required'));

    const reminderInDays = Number(probForm.reminderInDays !== undefined ? probForm.reminderInDays : 3);
    const cleanedTags = probForm.tags.split(',').map(t => t.trim()).filter(Boolean);
    const seen = new Set();
    const uniqueTags = [];
    for (const tag of cleanedTags) {
      const lower = tag.toLowerCase();
      if (!seen.has(lower)) {
        seen.add(lower);
        uniqueTags.push(tag);
      }
    }
    const finalTags = uniqueTags.slice(0, 5);
    const isMastered = reminderInDays === -2 || probForm.status === 'Mastered';

    const data = {
      ...probForm,
      status: isMastered ? 'Mastered' : probForm.status,
      tags: finalTags,
      platforms: probForm.platforms.filter(pl => pl.platform && pl.url.trim() !== ''),
      noRep: reminderInDays === -1 || isMastered,
      interval: (reminderInDays !== -1 && reminderInDays !== -2) ? reminderInDays : 3,
      date: probForm.date || today(),
    };
    delete data.reminderInDays;

    if (probModalId) {
      const p = problems.find(x => x.id === probModalId);
      const oldReminder = p.status === 'Mastered' ? -2 : (p.noRep ? -1 : p.interval);
      if (oldReminder !== reminderInDays || p.date !== data.date) {
        data.nextRev = (reminderInDays !== -1 && reminderInDays !== -2) ? addDays(data.date, reminderInDays) : null;
      }
      if (user && user.token) {
        return updateProblem(user.token, probModalId, data)
          .then(updated => {
            setProblems(probs => probs.map(x => x.id === probModalId ? mapProblem(updated) : x));
          });
      } else {
        setProblems(probs => probs.map(p => p.id === probModalId ? { ...p, ...data } : p));
        return Promise.resolve();
      }
    } else {
      const payload = {
        ...data,
        nextRev: (reminderInDays !== -1 && reminderInDays !== -2) ? addDays(data.date, reminderInDays) : null,
        revCount: 0,
      };
      if (user && user.token) {
        return createProblem(user.token, payload)
          .then(newProb => {
            setProblems(probs => [mapProblem(newProb), ...probs]);
            logAct();
          });
      } else {
        const newProb = { id: uid(), ...payload };
        setProblems(probs => [newProb, ...probs]);
        logAct();
        return Promise.resolve();
      }
    }
  };

  const deleteProblem = (id) => {
    const p = problems.find(x => x.id === id);
    if (!p) return Promise.reject(new Error('Problem not found'));
    
    if (user && user.token) {
      return updateProblemTrash(user.token, p._id || p.id, { isDeleted: true, delDate: today() })
        .then(updated => {
          setProblems(probs => probs.filter(x => x.id !== id));
          setTrash(t => [mapProblem(updated), ...t]);
        });
    } else {
      setProblems(probs => probs.filter(x => x.id !== id));
      setTrash(t => [{ ...p, delDate: today() }, ...t]);
      return Promise.resolve();
    }
  };

  const restoreProblem = (id) => {
    const p = trash.find(x => x.id === id);
    if (!p) return Promise.reject(new Error('Problem not found in trash'));

    if (user && user.token) {
      return updateProblemTrash(user.token, p._id || p.id, { isDeleted: false })
        .then(updated => {
          setTrash(t => t.filter(x => x.id !== id));
          setProblems(probs => [mapProblem(updated), ...probs]);
        });
    } else {
      setTrash(t => t.filter(x => x.id !== id));
      setProblems(probs => [{ ...p, delDate: null }, ...probs]);
      return Promise.resolve();
    }
  };

  const deletePermanent = (id) => {
    const p = trash.find(x => x.id === id);
    if (!p) return Promise.reject(new Error('Problem not found in trash'));

    if (user && user.token) {
      return deleteProblemPermanently(user.token, p._id || p.id)
        .then(() => {
          setTrash(t => t.filter(x => x.id !== id));
        });
    } else {
      setTrash(t => t.filter(x => x.id !== id));
      return Promise.resolve();
    }
  };

  const emptyTrash = () => {
    if (user && user.token) {
      return emptyTrashRequest(user.token)
        .then(() => setTrash([]));
    } else {
      setTrash([]);
      return Promise.resolve();
    }
  };

  const markReviewed = (id) => {
    const p = problems.find(x => x.id === id);
    if (!p) return Promise.reject(new Error('Problem not found'));

    const updatedRevCount = p.revCount + 1;
    const lastReviewedDate = today();
    if (user && user.token) {
      return updateProblem(user.token, p._id || p.id, { revCount: updatedRevCount, lastReviewed: lastReviewedDate })
        .then(updated => {
          setProblems(probs => probs.map(x => x.id === id ? mapProblem(updated) : x));
          logAct();
        });
    } else {
      setProblems(probs => probs.map(p => p.id === id ? { ...p, revCount: p.revCount + 1, lastReviewed: lastReviewedDate } : p));
      logAct();
      return Promise.resolve();
    }
  };

  const setReminder = (id, days) => {
    const p = problems.find(x => x.id === id);
    if (!p) return Promise.reject(new Error('Problem not found'));

    const payload = days === -2 ? {
      noRep: true,
      status: 'Mastered',
      nextRev: null,
    } : {
      noRep: days === -1,
      interval: days !== -1 ? days : p.interval,
      nextRev: days !== -1 ? addDays(today(), days) : null,
    };

    if (user && user.token) {
      return updateProblem(user.token, p._id || p.id, payload)
        .then(updated => {
          setProblems(probs => probs.map(x => x.id === id ? mapProblem(updated) : x));
        });
    } else {
      setProblems(probs => probs.map(x => x.id === id ? { ...x, ...payload } : x));
      return Promise.resolve();
    }
  };

  const toggleStar = (id) => {
    const p = problems.find(x => x.id === id);
    if (!p) return Promise.reject(new Error('Problem not found'));

    const starredState = !p.starred;
    if (user && user.token) {
      return updateProblem(user.token, p._id || p.id, { starred: starredState })
        .then(updated => {
          setProblems(probs => probs.map(x => x.id === id ? mapProblem(updated) : x));
        });
    } else {
      setProblems(probs => probs.map(p => p.id === id ? { ...p, starred: !p.starred } : p));
      return Promise.resolve();
    }
  };

  const addCollection = (name, description, color) => {
    const id = uid();
    if (user && user.token) {
      return createCollection(user.token, { id, name, description, color })
        .then(newColl => {
          setCollections(prev => [...prev, newColl]);
          return newColl;
        });
    } else {
      const newColl = { id, name, description, color };
      setCollections(prev => [...prev, newColl]);
      return Promise.resolve(newColl);
    }
  };

  const deleteCollection = (collId) => {
    if (user && user.token) {
      return deleteCollectionRequest(user.token, collId)
        .then(() => {
          setCollections(items => items.filter(item => item.id !== collId));
          setProblems(items => items.map(item => item.collId === collId ? { ...item, collId: '' } : item));
        });
    } else {
      setCollections(items => items.filter(item => item.id !== collId));
      setProblems(items => items.map(item => item.collId === collId ? { ...item, collId: '' } : item));
      return Promise.resolve();
    }
  };

  return {
    problems,
    setProblems,
    collections,
    setCollections,
    trash,
    setTrash,
    activity,
    setActivity,
    logAct,
    saveProblem,
    deleteProblem,
    restoreProblem,
    deletePermanent,
    emptyTrash,
    markReviewed,
    setReminder,
    toggleStar,
    addCollection,
    deleteCollection,
  };
}
