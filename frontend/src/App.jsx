import { useState, useEffect } from 'react';
import NoteForm from './components/NoteForm';
import NoteList from './components/NoteList';

function App() {
  const [notes, setNotes] = useState([]);

  useEffect(() => {
    fetchNotes();
  }, []);

  const fetchNotes = async () => {
    try {
      const res = await fetch('/notes'); // Using /notes to match backend
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

  return (
    <div className="min-h-screen bg-halloween-dark text-white p-8">
      <div className="max-w-4xl mx-auto">
        <header className="text-center mb-12">
          <h1 className="text-6xl font-spooky text-halloween-orange mb-4 drop-shadow-[0_0_10px_rgba(255,117,24,0.5)]">
            Spooky Notes
          </h1>
          <p className="text-halloween-purple text-lg italic animate-pulse">
            Keep your secrets safe in the dark...
          </p>
        </header>

        <NoteForm onAdd={addNote} />
        <NoteList notes={notes} onDelete={deleteNote} />
      </div>
    </div>
  );
}

export default App;
