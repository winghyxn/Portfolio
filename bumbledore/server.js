const express = require('express');
const mysql = require('mysql');
const bodyParser = require('body-parser');
const cors = require('cors');

const app = express();
const port = 3001;

app.use(bodyParser.json());
app.use(cors());

const db = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: '!iLovemysql69',
    database: 'myapp'
});

db.connect((err) => {
    if (err) {
        throw err;
    }
    console.log('MySQL connected...');
});

app.post('/create-account', (req, res) => {
    const { email, password } = req.body;
    const sql = 'INSERT INTO users (email, password) VALUES (?, ?)';

    db.query(sql, [email, password], (err, result) => {
        if (err) {
            return res.status(500).send(err);
        }
        res.status(200).send('Account created successfully');
    });
});

app.listen(port, () => {
    console.log(`Server running on port ${port}`);
});
