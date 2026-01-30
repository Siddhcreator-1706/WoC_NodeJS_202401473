const express = require('express');
const router = express.Router();
const { protect } = require('../middleware/auth');
const Note = require('../models/Note');

// All notes routes require authentication
router.use(protect);

// @route   GET /notes
// @desc    Get all notes
// @access  Private (any authenticated user)
router.get('/', async (req, res) => {
    try {
        const notes = await Note.find().sort({ createdAt: -1 });

        // Return notes with ownership info
        const sanitizedNotes = notes.map(note => ({
            id: note._id,
            title: note.title,
            content: note.content,
            createdAt: note.createdAt,
            isOwner: note.createdBy?.toString() === req.user._id.toString()
        }));

        res.json(sanitizedNotes);
    } catch (error) {
        console.error('Error fetching notes:', error);
        res.status(500).json({ error: 'Failed to fetch notes' });
    }
});

// @route   GET /notes/:id
// @desc    Get single note by ID
// @access  Private
router.get('/:id', async (req, res) => {
    try {
        const note = await Note.findById(req.params.id);

        if (!note) {
            return res.status(404).json({ error: 'Note not found' });
        }

        res.json({
            id: note._id,
            title: note.title,
            content: note.content,
            createdAt: note.createdAt,
            isOwner: note.createdBy?.toString() === req.user._id.toString()
        });
    } catch (error) {
        // Handle invalid ObjectId
        if (error.name === 'CastError') {
            return res.status(400).json({ error: 'Invalid note ID' });
        }
        console.error('Error fetching note:', error);
        res.status(500).json({ error: 'Failed to fetch note' });
    }
});

// @route   POST /notes
// @desc    Create a new note
// @access  Private (any authenticated user)
router.post('/', async (req, res) => {
    try {
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

        const newNote = new Note({
            title: title.trim(),
            content: content.trim(),
            createdBy: req.user._id
        });

        await newNote.save();

        res.status(201).json({
            id: newNote._id,
            title: newNote.title,
            content: newNote.content,
            createdAt: newNote.createdAt,
            isOwner: true
        });
    } catch (error) {
        console.error('Error creating note:', error);

        // Handle validation errors
        if (error.name === 'ValidationError') {
            const messages = Object.values(error.errors).map(err => err.message);
            return res.status(400).json({ error: messages.join(', ') });
        }

        res.status(500).json({ error: 'Failed to create note' });
    }
});

// @route   PUT /notes/:id
// @desc    Update a note
// @access  Private (owner or admin)
router.put('/:id', async (req, res) => {
    try {
        const { title, content } = req.body;

        const note = await Note.findById(req.params.id);

        if (!note) {
            return res.status(404).json({ error: 'Note not found' });
        }

        // Only owner can update
        const isOwner = note.createdBy?.toString() === req.user._id.toString();

        if (!isOwner) {
            return res.status(403).json({ error: 'Not authorized to update this note' });
        }

        // Validate input
        if (title && title.length > 100) {
            return res.status(400).json({ error: 'Title cannot exceed 100 characters' });
        }
        if (content && content.length > 5000) {
            return res.status(400).json({ error: 'Content cannot exceed 5000 characters' });
        }

        // Update fields
        if (title) note.title = title.trim();
        if (content) note.content = content.trim();
        note.updatedAt = new Date();

        await note.save();

        res.json({
            id: note._id,
            title: note.title,
            content: note.content,
            createdAt: note.createdAt,
            updatedAt: note.updatedAt,
            isOwner
        });
    } catch (error) {
        // Handle invalid ObjectId
        if (error.name === 'CastError') {
            return res.status(400).json({ error: 'Invalid note ID' });
        }

        // Handle validation errors
        if (error.name === 'ValidationError') {
            const messages = Object.values(error.errors).map(err => err.message);
            return res.status(400).json({ error: messages.join(', ') });
        }

        console.error('Error updating note:', error);
        res.status(500).json({ error: 'Failed to update note' });
    }
});

// @route   DELETE /notes/:id
// @desc    Delete a note
// @access  Private (Owner or Admin)
router.delete('/:id', async (req, res) => {
    try {
        const note = await Note.findById(req.params.id);

        if (!note) {
            return res.status(404).json({ error: 'Note not found' });
        }

        // Check if user is owner
        const isOwner = note.createdBy?.toString() === req.user._id.toString();

        if (!isOwner) {
            return res.status(403).json({ error: 'Not authorized to delete this note' });
        }

        await note.deleteOne();

        res.status(204).send();
    } catch (error) {
        // Handle invalid ObjectId
        if (error.name === 'CastError') {
            return res.status(400).json({ error: 'Invalid note ID' });
        }
        console.error('Error deleting note:', error);
        res.status(500).json({ error: 'Failed to delete note' });
    }
});

module.exports = router;
