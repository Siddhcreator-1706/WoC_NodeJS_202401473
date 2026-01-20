import { useState, useEffect } from 'react';
import Navbar from './components/Navbar';
import NoteForm from './components/NoteForm';
import NoteList from './components/NoteList';
import Login from './components/Login';
import Signup from './components/Signup';

function App() {
  const [notes, setNotes] = useState([]);
  const [user, setUser] = useState(null);
  const [view, setView] = useState('login'); // 'login', 'signup', 'home'

  useEffect(() => {
    if (user) {
      fetchNotes();
    }
  }, [user]);

  const fetchNotes = async () => {
    try {
      const res = await fetch('/notes');
      if (res.ok) {
        const data = await res.json();
        setNotes(data);
      }
    } catch (err) {
      console.error('Failed to fetch notes', err);
    }
  };

  const addNote = async (note) => {
    try {
      const res = await fetch('/notes', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(note),
      });
      if (res.ok) {
        fetchNotes();
      }
    } catch (err) {
      console.error('Failed to add note', err);
    }
  };

  const deleteNote = async (id) => {
    if (!confirm('Banish this note to the nether realm?')) return;
    try {
      const res = await fetch(`/notes/${id}`, { method: 'DELETE' });
      if (res.ok) {
        fetchNotes();
      }
    } catch (err) {
      console.error('Failed to delete note', err);
    }
  };

  const handleLogin = (userData) => {
    setUser(userData);
    setView('home');
  };

  const handleLogout = () => {
    setUser(null);
    setView('login');
    setNotes([]);
  };

  return (
    <div className="min-h-screen bg-halloween-darker text-halloween-text font-sans selection:bg-halloween-orange selection:text-white pb-12">
      <Navbar user={user} onViewChange={setView} onLogout={handleLogout} />

      <main className="max-w-4xl mx-auto pt-24 px-6">
        {!user ? (
          view === 'login' ? (
            <Login onLogin={handleLogin} switchToSignup={() => setView('signup')} />
          ) : (
            <Signup onSignup={handleLogin} switchToLogin={() => setView('login')} />
          )
        ) : (
          <div className="animate-fade-in-up">
            <header className="text-center mb-12">
              <h2 className="text-5xl font-bold text-white mb-4 font-spooky tracking-widest drop-shadow-[0_0_15px_rgba(255,107,0,0.4)]">
                Your Grimoire
              </h2>
              <p className="text-halloween-purple text-lg italic">
                Secrets documented: {notes.length}
              </p>
            </header>

            <NoteForm onAdd={addNote} />
            <div className="mt-12">
              <NoteList notes={notes} onDelete={deleteNote} />
            </div>
          </div>
        )}
      </main>
    </div>
  );
}

export default App;