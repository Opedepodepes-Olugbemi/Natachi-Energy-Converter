import express from 'express';
import sqlite3 from 'sqlite3';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const router = express.Router();

const db = new sqlite3.Database(join(__dirname, '..', '..', 'energy_database.sqlite'));

// Energy Types
router.get('/energy-types', (req, res) => {
    db.all('SELECT * FROM energy_types', (err, rows) => {
        if (err) {
            res.status(500).json({ error: err.message });
            return;
        }
        res.json(rows);
    });
});

// Conversion Factors
router.get('/conversion-factors', (req, res) => {
    db.all('SELECT * FROM conversion_factors', (err, rows) => {
        if (err) {
            res.status(500).json({ error: err.message });
            return;
        }
        res.json(rows);
    });
});

// Conversion History
router.get('/conversion-history', (req, res) => {
    db.all('SELECT * FROM conversion_history', (err, rows) => {
        if (err) {
            res.status(500).json({ error: err.message });
            return;
        }
        res.json(rows);
    });
});

// Perform Conversion
router.post('/convert', (req, res) => {
    const { from_type, to_type, value } = req.body;
    db.get(
        'SELECT factor FROM conversion_factors WHERE from_type = ? AND to_type = ?',
        [from_type, to_type],
        (err, row) => {
            if (err) {
                res.status(500).json({ error: err.message });
                return;
            }
            if (!row) {
                return res.status(400).json({ error: 'Conversion factor not found' });
            }
            
            const factor = row.factor;
            const result = value * factor;
            
            db.run(
                'INSERT INTO conversion_history (from_type, to_type, input_value, output_value) VALUES (?, ?, ?, ?)',
                [from_type, to_type, value, result],
                (err) => {
                    if (err) {
                        res.status(500).json({ error: err.message });
                        return;
                    }
                    res.json({ result });
                }
            );
        }
    );
});

export default router;
