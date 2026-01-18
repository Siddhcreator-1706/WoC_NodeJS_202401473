require('dotenv').config(); // Load environment variables
const express = require('express');
const path = require('path'); // Node.js module for path manipulation
const app = express();
const notesRouter = require('./routes/notes'); // Import notes router
const logger = require('./middleware/logger'); // Import logger middleware
const PORT = process.env.PORT || 3000; // Use environment variable

// Middleware
app.use(express.json()); // Parse JSON bodies
app.use(logger); // Custom request logger
app.use(express.static(path.join(__dirname, '../frontend/dist'))); // Serve React app

// GET /test - Basic test route
app.get('/test', (req, res) => {
  res.json({ message: 'Express server is working!', status: 'success' });
});

// Routes
app.use('/notes', notesRouter); // Mount notes router at /notes


// Serve React App for any other requests (Client-side routing support)
app.use((req, res) => {
  res.sendFile(path.join(__dirname, '../frontend/dist', 'index.html'));
});

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
