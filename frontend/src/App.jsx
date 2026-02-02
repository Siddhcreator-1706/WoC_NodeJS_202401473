import { useState, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Analytics } from '@vercel/analytics/react';
import Navbar from './components/Navbar';
import NoteForm from './components/NoteForm';
import NoteList from './components/NoteList';
import Login from './components/Login';
import Signup from './components/Signup';

function App() {
  const [notes, setNotes] = useState([]);
  const [user, setUser] = useState(null);
  const [view, setView] = useState('login');
  const [isLoading, setIsLoading] = useState(true);

  // Memoize random particles to avoid "impure render" errors with Math.random()
  // Move random particle generation to useEffect to avoid "impure render" errors
  const [particles, setParticles] = useState([]);
  const [editingNote, setEditingNote] = useState(null);

  useEffect(() => {
    setParticles([...Array(20)].map(() => ({
      left: Math.random() * 100,
      top: Math.random() * 100,
      duration: 5 + Math.random() * 5,
      delay: Math.random() * 5
    })));
  }, []);

  const getAuthHeaders = useCallback(() => {
    return {
      'Content-Type': 'application/json'
    };
  }, []);

  const handleLogout = useCallback(async () => {
    try {
      // Call backend to invalidate session
      await fetch('/auth/logout', {
        method: 'POST',
        headers: getAuthHeaders()
      });
    } catch (err) {
      console.error('Logout failed', err);
    } finally {
      // Clear local state regardless of server success
      setUser(null);
      setView('login');
      setNotes([]);
      setEditingNote(null);
    }
  }, []);

  const fetchNotes = useCallback(async () => {
    try {
      const res = await fetch('/notes', {
        headers: getAuthHeaders()
      });
      if (res.ok) {
        const data = await res.json();
        setNotes(data);
      } else if (res.status === 401) {
        handleLogout();
      }
    } catch (err) {
      console.error('Failed to fetch notes', err);
    }
  }, [getAuthHeaders, handleLogout]);

  const handleLogoutAll = useCallback(async () => {
    try {
      await fetch('/auth/logout-all', {
        method: 'POST',
        headers: getAuthHeaders()
      });
      alert('Logged out from all devices successfully.');
    } catch (err) {
      console.error('Logout all failed', err);
    } finally {
      handleLogout(); // Perform local logout as well
    }
  }, [handleLogout, getAuthHeaders]);

  useEffect(() => {
    const checkAuth = async () => {
      // Check for 'logged_in' flag cookie (Double Cookie Pattern)
      const isLoggedInQuery = document.cookie
        .split('; ')
        .find(row => row.startsWith('logged_in='))
        ?.split('=')[1];

      if (isLoggedInQuery !== 'true') {
        // No flag cookie? Don't bother the server.
        setIsLoading(false);
        return;
      }

      try {
        const res = await fetch('/auth/me');
        if (res.ok) {
          const data = await res.json();
          setUser(data.user);
          setView('home');
        } else {
          // Cookie existed but token was invalid (Stale state). 
          // Browser console will show 401, which is correct here (drift).
        }
      } catch (err) {
        console.error('Auth check failed', err);
      }
      setIsLoading(false);
    };
    checkAuth();
  }, []);

  useEffect(() => {
    if (user) {
      fetchNotes();
    }
  }, [user, fetchNotes]);

  const addNote = useCallback(async (note) => {
    try {
      const res = await fetch('/notes', {
        method: 'POST',
        headers: getAuthHeaders(),
        body: JSON.stringify(note),
      });
      if (res.ok) {
        fetchNotes();
      } else if (res.status === 401) {
        handleLogout();
      }
    } catch (err) {
      console.error('Failed to add note', err);
    }
  }, [fetchNotes, getAuthHeaders, handleLogout]);

  const updateNote = useCallback(async (id, updatedNote) => {
    try {
      const res = await fetch(`/notes/${id}`, {
        method: 'PUT',
        headers: getAuthHeaders(),
        body: JSON.stringify(updatedNote),
      });
      if (res.ok) {
        fetchNotes();
        setEditingNote(null);
      } else if (res.status === 401) {
        handleLogout();
      }
    } catch (err) {
      console.error('Failed to update note', err);
    }
  }, [fetchNotes, getAuthHeaders, handleLogout]);

  const deleteNote = useCallback(async (id) => {
    if (!confirm('Banish this note to the nether realm?')) return;
    try {
      const res = await fetch(`/notes/${id}`, {
        method: 'DELETE',
        headers: getAuthHeaders()
      });
      if (res.ok) {
        fetchNotes();
        // Since we are using an ID, we need to access current editingNote state?
        // But editingNote is in state.
        // We can't access state in useCallback unless it's in deps.
        // But better is to just check id.
        setEditingNote((prev) => (prev && prev.id === id ? null : prev));
      } else if (res.status === 401) {
        handleLogout();
      }
    } catch (err) {
      console.error('Failed to delete note', err);
    }
  }, [fetchNotes, getAuthHeaders, handleLogout]);

  const handleLogin = (userData) => {
    setUser(userData);
    setView('home');
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-halloween-darker flex items-center justify-center">
        <motion.div
          className="text-center"
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5 }}
        >
          <motion.div
            className="text-8xl mb-6"
            animate={{
              rotate: [0, 10, -10, 0],
              scale: [1, 1.1, 1]
            }}
            transition={{
              duration: 1.5,
              repeat: Infinity,
              ease: 'easeInOut'
            }}
          >
            🎃
          </motion.div>
          <motion.p
            className="text-halloween-text text-xl font-spooky tracking-wider"
            animate={{ opacity: [0.5, 1, 0.5] }}
            transition={{ duration: 2, repeat: Infinity }}
          >
            Awakening the spirits...
          </motion.p>
        </motion.div>
      </div>
    );
  }

  return (
    <div className={`${!user ? 'min-h-screen w-full flex flex-col' : 'min-h-screen pb-12'} bg-halloween-darker text-halloween-text font-sans selection:bg-halloween-orange selection:text-white overflow-x-hidden`}>
      <Navbar
        user={user}
        onViewChange={setView}
        onLogout={handleLogout}
        onLogoutAll={handleLogoutAll}
        currentView={view}
      />

      <main className={!user ? 'flex-grow flex items-center justify-center p-4 pt-24 relative z-10' : 'max-w-4xl mx-auto pt-24 px-6 relative z-10'}>
        <AnimatePresence mode="wait">
          {!user ? (
            view === 'login' ? (
              <motion.div
                key="login"
                className="w-full max-w-md"
                initial={{ opacity: 0, x: -50 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 50 }}
                transition={{ duration: 0.3 }}
              >
                <Login onLogin={handleLogin} switchToSignup={() => setView('signup')} />
              </motion.div>
            ) : (
              <motion.div
                key="signup"
                className="w-full max-w-md"
                initial={{ opacity: 0, x: 50 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -50 }}
                transition={{ duration: 0.3 }}
              >
                <Signup onSignup={handleLogin} switchToLogin={() => setView('login')} />
              </motion.div>
            )
          ) : (
            <motion.div
              key="home"
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -30 }}
              transition={{ duration: 0.5 }}
            >
              <motion.header
                className="text-center mb-12"
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 }}
              >
                <motion.h2
                  className="text-5xl font-bold text-white mb-4 font-spooky tracking-widest drop-shadow-[0_0_15px_rgba(255,107,0,0.4)]"
                  animate={{
                    textShadow: [
                      '0 0 15px rgba(255, 107, 0, 0.4)',
                      '0 0 30px rgba(255, 107, 0, 0.6)',
                      '0 0 15px rgba(255, 107, 0, 0.4)'
                    ]
                  }}
                  transition={{ duration: 3, repeat: Infinity, ease: 'easeInOut' }}
                >
                  Your Grimoire
                </motion.h2>
                <motion.p
                  className="text-halloween-purple text-lg italic"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.4 }}
                >
                  Secrets documented: {notes.length}
                </motion.p>
                {/* Admin badge removed as requested */}
              </motion.header>

              <NoteForm
                key={editingNote ? editingNote.id : 'new'}
                onAdd={addNote}
                onUpdate={updateNote}
                editingNote={editingNote}
                onCancelEdit={() => setEditingNote(null)}
              />
              <div className="mt-12">
                <NoteList
                  notes={notes}
                  onDelete={deleteNote}
                  onEdit={setEditingNote}
                />
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </main>

      {/* Floating particles background */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden z-0">
        {particles.map((p, i) => (
          <motion.div
            key={i}
            className="absolute w-1 h-1 bg-halloween-purple/20 rounded-full"
            style={{
              left: `${p.left}%`,
              top: `${p.top}%`,
            }}
            animate={{
              y: [0, -100, 0],
              opacity: [0, 0.5, 0],
            }}
            transition={{
              duration: p.duration,
              repeat: Infinity,
              delay: p.delay,
              ease: 'easeInOut'
            }}
          />
        ))}
      </div>
      <Analytics />
    </div>
  );
}

export default App;