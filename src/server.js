const express = require('express');
const path = require('path');
const app = express();
const notesRouter = require('./routes/notes');
const authRouter = require('./routes/auth');
const logger = require('./middleware/logger');
require('dotenv').config();
const PORT = process.env.PORT || 3000;

app.use(express.json());
app.use(logger);
app.use(express.static(path.join(__dirname, '../frontend/dist')));

app.get('/test', (req, res) => {
  res.json({ message: 'Express server is working!', status: 'success' });
});

app.use('/notes', notesRouter);
app.use('/auth', authRouter);

app.use((req, res) => {
  res.sendFile(path.join(__dirname, '../frontend/dist', 'index.html'));
});

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
