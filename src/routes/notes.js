const express = require('express');
const router = express.Router();

let notes = [
    {
        id: 1,
        title: "Express Basics",
        content: "Learn routes and middleware."
    }
];

const generateId = () => {
    return notes.length > 0 ? Math.max(...notes.map(n => n.id)) + 1 : 1;
};

router.get('/', (req, res) => {
    res.json(notes);
});

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

router.put('/:id', (req, res) => {
    const id = parseInt(req.params.id);
    const { title, content } = req.body;

    const noteIndex = notes.findIndex(n => n.id === id);

    if (noteIndex === -1) {
        return res.status(404).json({ error: 'Note not found' });
    }

    if (title) notes[noteIndex].title = title;
    if (content) notes[noteIndex].content = content;

    res.json(notes[noteIndex]);
});

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
