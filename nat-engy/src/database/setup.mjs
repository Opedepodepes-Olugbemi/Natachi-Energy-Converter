import express from 'express';
import sqlite3 from 'sqlite3';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';

const app = express();
const port = 3000;

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const db = new sqlite3.Database(join(__dirname, '..', '..', 'energy_database.sqlite'));

app.get('/api/appliances', (req, res) => {
  db.all('SELECT * FROM appliances', (err, rows) => {
    if (err) {
      res.status(500).json({ error: err.message });
      return;
    }
    res.json(rows);
  });
});

app.get('/api/energy-production', (req, res) => {
  db.all(`
    SELECT st.name as state, es.source, es.percentage
    FROM states_and_territories st
    JOIN energy_sources es ON st.id = es.state_id
  `, (err, rows) => {
    if (err) {
      res.status(500).json({ error: err.message });
      return;
    }
    const result = rows.reduce((acc, row) => {
      if (!acc[row.state]) {
        acc[row.state] = { name: row.state, energy_sources: {} };
      }
      acc[row.state].energy_sources[row.source] = row.percentage;
      return acc;
    }, {});
    res.json(Object.values(result));
  });
});

app.listen(port, () => {
  console.log(`Server running at http://localhost:${port}`);
});
