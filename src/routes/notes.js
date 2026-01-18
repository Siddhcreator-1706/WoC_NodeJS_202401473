const express = require('express');
const router = express.Router();

// In-memory data storage (RAM)
let notes = [
    {
        id: 1,
        title: "Express Basics",
        content: "Learn routes and middleware."
    }
];

// Helper to generate IDs
const generateId = () => {
    return notes.length > 0 ? Math.max(...notes.map(n => n.id)) + 1 : 1;
};

// GET /notes - Retrieve all notes
router.get('/', (req, res) => {
    res.json(notes);
});

// POST /notes - Create a new note
router.post('/', (req, res) => {
    const { title, content } = req.body;
    if (!title || !content) {
        return res.status(400).json({ error: 'Title and content are required' });
    }

    const newNote = {
        id: generateId(),
        title,
        content
    };

    notes.push(newNote);
    res.status(201).json(newNote);
});

// PUT /notes/:id - Update a note
router.put('/:id', (req, res) => {
    const id = parseInt(req.params.id);
    const { title, content } = req.body;

    const noteIndex = notes.findIndex(n => n.id === id);

    if (noteIndex === -1) {
        return res.status(404).json({ error: 'Note not found' });
    }

    // Update fields if provided
    if (title) notes[noteIndex].title = title;
    if (content) notes[noteIndex].content = content;

    res.json(notes[noteIndex]);
});

// DELETE /notes/:id - Delete a note
router.delete('/:id', (req, res) => {
    const id = parseInt(req.params.id);
    const initialLength = notes.length;
    notes = notes.filter(n => n.id !== id);

    if (notes.length === initialLength) {
        return res.status(404).json({ error: 'Note not found' });
    }

    res.status(204).send();
});

module.exports = router;
