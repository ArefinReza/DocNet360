const express = require('express');
const sqlite3 = require('sqlite3').verbose();
const path = require('path');
const app = express();
const port = 3000;

// Connect to SQLite database (create a new one if it doesn't exist)
const db = new sqlite3.Database('database.db');

// Create a table to store data (if not exists)
db.run('CREATE TABLE IF NOT EXISTS data (id INTEGER PRIMARY KEY AUTOINCREMENT, value TEXT)');

app.use(express.static('public'));
app.use(express.json());

// Route to get data from the database
app.get('/api/data', (req, res) => {
    db.all('SELECT * FROM data', (err, rows) => {
        if (err) {
            console.error(err);
            res.status(500).json({ error: 'Internal Server Error' });
        } else {
            res.json(rows);
        }
    });
});

// Route to add data to the database
app.post('/api/data', (req, res) => {
    const { value } = req.body;
    db.run('INSERT INTO data (value) VALUES (?)', [value], function (err) {
        if (err) {
            console.error(err);
            res.status(500).json({ error: 'Internal Server Error' });
        } else {
            res.json({ id: this.lastID, value });
        }
    });
});

// Route to send the HTML file
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

app.listen(port, () => {
    console.log(`Server is running at http://localhost:${port}`);
});
