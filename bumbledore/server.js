const express = require('express');
const mysql = require('mysql');
const bodyParser = require('body-parser');
const cors = require('cors');
const bcrypt = require('bcrypt');
const helmet = require('helmet');

const app = express();
const port = 3001;

app.use(bodyParser.json());
app.use(cors());
app.use(helmet());

const db = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: '!iLovesql69',
    database: 'myapp'
});

db.connect((err) => {
    if (err) {
        console.error('MySQL connection error:', err);
        throw err;
    }
    console.log('MySQL connected...');
});

app.options('/create-account', cors()); // Enable preflight for create-account
app.options('/login', cors()); // Enable preflight for login

app.post('/create-account', async (req, res) => {
    const { email, password } = req.body;

    if (!email || !password) {
        return res.status(400).send('Email and password are required');
    }

    try {
        const hashedPassword = await bcrypt.hash(password, 10);
        const sql = 'INSERT INTO users (email, password) VALUES (?, ?)';

        db.query(sql, [email, hashedPassword], (err, result) => {
            if (err) {
                if (err.code === 'ER_DUP_ENTRY') {
                    return res.status(400).send('Email already exists');
                }
                console.error('Database insertion error:', err);
                return res.status(500).send('Failed to create account');
            }
            res.status(200).send('Account created successfully');
        });
    } catch (err) {
        console.error('Password hashing error:', err);
        res.status(500).send('Failed to create account');
    }
});

app.post('/login', async (req, res) => {
    const { email, password } = req.body;
    const sql = 'SELECT password FROM users WHERE email = ?';

    try {
        db.query(sql, [email], async (err, results) => {
            if (err) {
                return res.status(500).send(err);
            }
            if (results.length > 0) {
                const hashedPassword = results[0].password;
                const isMatch = await bcrypt.compare(password, hashedPassword);
                if (isMatch) {
                    return res.status(200).send('Login successful');
                } else {
                    return res.status(401).send('Invalid email or password');
                }
            } else {
                return res.status(401).send('Invalid email or password');
            }
        });
    } catch (error) {
        console.error('Error:', error);
        res.status(500).send('Failed to login');
    }
});

app.listen(port, () => {
    console.log(`Server running on port ${port}`);
});

