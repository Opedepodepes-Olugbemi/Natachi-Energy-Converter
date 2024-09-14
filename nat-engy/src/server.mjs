import express from 'express';
import sqlite3 from 'sqlite3';
import { fileURLToPath } from 'url';
import path from 'path';
import apiRoutes from './routes/api.mjs';
import deviceRoutes from './routes/deviceRoutes.mjs';
import conversionRoutes from './routes/conversionRoutes.mjs';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const port = process.env.PORT || 3000;

// Database setup
const db = new sqlite3.Database('./database/energy_database.sqlite', (err) => {
  if (err) {
    console.error('Error opening database:', err.message);
  } else {
    console.log('Connected to the SQLite database.');
  }
});

// View engine setup
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));

// Middleware
app.use(express.json());
app.use(express.static(path.join(__dirname, 'public')));

// Routes
app.get('/', (req, res) => {
    res.render('index');
});

app.get('/device-leaderboard', (req, res) => {
    res.render('deviceLeaderboard');
});

app.get('/usage-statistics', (req, res) => {
    res.render('usageStatistics');
});

app.get('/search-location', (req, res) => {
    res.render('locationSelection');
});

// API routes
app.use('/api', apiRoutes);
app.use('/api/devices', deviceRoutes);
app.use('/api/conversions', conversionRoutes);

// Error handling middleware
app.use((req, res, next) => {
    res.status(404).render('error', { message: 'Page not found' });
});

app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).render('error', { message: 'Something went wrong!' });
});

// Start server
app.listen(port, () => {
  console.log(`Server running at http://localhost:${port}`);
});
