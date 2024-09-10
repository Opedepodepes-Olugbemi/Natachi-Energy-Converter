import sqlite3 from 'sqlite3';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const db = new sqlite3.Database(join(__dirname, '..', '..', 'energy_database.sqlite'));

const setupScript = `
-- Drop existing tables if they exist
DROP TABLE IF EXISTS device_locations;
DROP TABLE IF EXISTS energy_sources;
DROP TABLE IF EXISTS states;
DROP TABLE IF EXISTS devices;

-- Create tables
CREATE TABLE devices (
    id INTEGER PRIMARY KEY,
    name TEXT NOT NULL
);

CREATE TABLE states (
    id INTEGER PRIMARY KEY,
    name TEXT NOT NULL
);

CREATE TABLE energy_sources (
    id INTEGER PRIMARY KEY,
    state_id INTEGER,
    source TEXT NOT NULL,
    percentage INTEGER NOT NULL,
    FOREIGN KEY (state_id) REFERENCES states(id)
);

CREATE TABLE device_locations (
    id INTEGER PRIMARY KEY,
    device_id INTEGER,
    state_id INTEGER,
    consumption REAL NOT NULL,
    running_time REAL NOT NULL,
    FOREIGN KEY (device_id) REFERENCES devices(id),
    FOREIGN KEY (state_id) REFERENCES states(id)
);

-- Insert data
INSERT INTO devices (name) VALUES
    ('Refrigerator'),
    ('Air Conditioner'),
    ('Heater'),
    ('Washing Machine'),
    ('Dryer'),
    ('Dishwasher'),
    ('Oven'),
    ('Microwave'),
    ('Toaster'),
    ('Coffee Maker'),
    ('Television'),
    ('Computer'),
    ('Lamp');

INSERT INTO states (name) VALUES
    ('New South Wales'),
    ('Victoria'),
    ('Queensland'),
    ('Western Australia'),
    ('South Australia'),
    ('Tasmania'),
    ('Australian Capital Territory'),
    ('Northern Territory');

INSERT INTO energy_sources (state_id, source, percentage) VALUES
    (1, 'wind', 12), (1, 'solar', 15), (1, 'gas', 25), (1, 'coal', 48),
    (2, 'wind', 20), (2, 'solar', 22), (2, 'gas', 30), (2, 'coal', 28),
    (3, 'wind', 10), (3, 'solar', 20), (3, 'gas', 25), (3, 'coal', 45),
    (4, 'wind', 15), (4, 'solar', 20), (4, 'gas', 35), (4, 'coal', 30),
    (5, 'wind', 40), (5, 'solar', 30), (5, 'gas', 20), (5, 'coal', 10),
    (6, 'wind', 60), (6, 'solar', 20), (6, 'gas', 10), (6, 'coal', 10),
    (7, 'wind', 30), (7, 'solar', 40), (7, 'gas', 20), (7, 'coal', 10),
    (8, 'wind', 20), (8, 'solar', 30), (8, 'gas', 40), (8, 'coal', 10);

-- Insert device_locations data (example data, adjust as needed)
INSERT INTO device_locations (device_id, state_id, consumption, running_time) VALUES
    (1, 1, 2.4, 24), (1, 2, 2.5, 24), (1, 3, 2.6, 24), (1, 4, 2.3, 24),
    (2, 1, 8.4, 8), (2, 2, 8.6, 8), (2, 3, 8.8, 8), (2, 4, 8.2, 8),
    (3, 1, 36.0, 6), (3, 2, 37.0, 6), (3, 3, 38.0, 6), (3, 4, 35.0, 6),
    (4, 1, 12.0, 2), (4, 2, 12.2, 2), (4, 3, 12.4, 2), (4, 4, 11.8, 2),
    (5, 1, 72.0, 1), (5, 2, 73.0, 1), (5, 3, 74.0, 1), (5, 4, 71.0, 1);
-- Add more device_locations data as needed
`;

db.exec(setupScript, (err) => {
  if (err) {
    console.error('Error setting up database:', err);
  } else {
    console.log('Database setup complete');
  }
  db.close();
});

export default db;