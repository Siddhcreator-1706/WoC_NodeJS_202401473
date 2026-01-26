const express = require('express');
const router = express.Router();
const { protect, isAdmin } = require('../middleware/auth');

// Store notes with user association
let notes = [
    {
        id: 1,
        title: "Express Basics",
        content: "Learn routes and middleware.",
        createdBy: null, // System note
        createdAt: new Date()
    }
];

const generateId = () => {
    return notes.length > 0 ? Math.max(...notes.map(n => n.id)) + 1 : 1;
};

// All notes routes require authentication
router.use(protect);

// @route   GET /notes
// @desc    Get all notes
// @access  Private (any authenticated user)
router.get('/', (req, res) => {
    // Return notes with sanitized output
    const sanitizedNotes = notes.map(note => ({
        id: note.id,
        title: note.title,
        content: note.content,
        createdAt: note.createdAt,
        isOwner: note.createdBy?.toString() === req.user._id.toString()
    }));
    res.json(sanitizedNotes);
});

// @route   GET /notes/:id
// @desc    Get single note by ID
// @access  Private
router.get('/:id', (req, res) => {
    const id = parseInt(req.params.id);

    if (isNaN(id) || id < 1) {
        return res.status(400).json({ error: 'Invalid note ID' });
    }

    const note = notes.find(n => n.id === id);

    if (!note) {
        return res.status(404).json({ error: 'Note not found' });
    }

    res.json({
        id: note.id,
        title: note.title,
        content: note.content,
        createdAt: note.createdAt,
        isOwner: note.createdBy?.toString() === req.user._id.toString()
    });
});

// @route   POST /notes
// @desc    Create a new note
// @access  Private (any authenticated user)
router.post('/', (req, res) => {
    const { title, content } = req.body;

    // Validate input
    if (!title || !content) {
        return res.status(400).json({ error: 'Title and content are required' });
    }

    // Validate lengths
    if (title.length > 100) {
        return res.status(400).json({ error: 'Title cannot exceed 100 characters' });
    }
    if (content.length > 5000) {
        return res.status(400).json({ error: 'Content cannot exceed 5000 characters' });
    }

    const newNote = {
        id: generateId(),
        title: title.trim(),
        content: content.trim(),
        createdBy: req.user._id,
        createdAt: new Date()
    };

    notes.push(newNote);

    res.status(201).json({
        id: newNote.id,
        title: newNote.title,
        content: newNote.content,
        createdAt: newNote.createdAt,
        isOwner: true
    });
});

// @route   PUT /notes/:id
// @desc    Update a note
// @access  Private (owner or admin)
router.put('/:id', (req, res) => {
    const id = parseInt(req.params.id);

    if (isNaN(id) || id < 1) {
        return res.status(400).json({ error: 'Invalid note ID' });
    }

    const { title, content } = req.body;
    const noteIndex = notes.findIndex(n => n.id === id);

    if (noteIndex === -1) {
        return res.status(404).json({ error: 'Note not found' });
    }

    const note = notes[noteIndex];

    // Only owner or admin can update
    const isOwner = note.createdBy?.toString() === req.user._id.toString();
    const isUserAdmin = req.user.role === 'admin';

    if (!isOwner && !isUserAdmin) {
        return res.status(403).json({ error: 'Not authorized to update this note' });
    }

    // Validate input
    if (title && title.length > 100) {
        return res.status(400).json({ error: 'Title cannot exceed 100 characters' });
    }
    if (content && content.length > 5000) {
        return res.status(400).json({ error: 'Content cannot exceed 5000 characters' });
    }

    if (title) notes[noteIndex].title = title.trim();
    if (content) notes[noteIndex].content = content.trim();
    notes[noteIndex].updatedAt = new Date();

    res.json({
        id: notes[noteIndex].id,
        title: notes[noteIndex].title,
        content: notes[noteIndex].content,
        createdAt: notes[noteIndex].createdAt,
        updatedAt: notes[noteIndex].updatedAt,
        isOwner
    });
});

// @route   DELETE /notes/:id
// @desc    Delete a note
// @access  Private (Admin only)
router.delete('/:id', isAdmin, (req, res) => {
    const id = parseInt(req.params.id);

    if (isNaN(id) || id < 1) {
        return res.status(400).json({ error: 'Invalid note ID' });
    }

    const initialLength = notes.length;
    notes = notes.filter(n => n.id !== id);

    if (notes.length === initialLength) {
        return res.status(404).json({ error: 'Note not found' });
    }

    res.status(204).send();
});

module.exports = router;
