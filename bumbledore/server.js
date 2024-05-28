const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const bcrypt = require('bcrypt');
const { MongoClient } = require('mongodb');
const helmet = require('helmet');

const app = express();
const port = 3001;

app.use(bodyParser.json());
app.use(cors());
app.use(helmet());

const uri = 'mongodb://localhost:27017';
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true });

async function createAccount(req, res) {
    const { email, password } = req.body;
    if (!email || !password) {
        return res.status(400).send('Email and password are required');
    }

    try {
        const hashedPassword = await bcrypt.hash(password, 10);
        await client.connect();
        const database = client.db('myappdb');
        const users = database.collection('users');

        const existingUser = await users.findOne({ email: email });
        if (existingUser) {
            return res.status(400).send('Email already exists');
        }

        const result = await users.insertOne({ email: email, password: hashedPassword });
        res.status(200).send('Account created successfully');
    } catch (error) {
        console.error('Error creating account:', error);
        res.status(500).send('Failed to create account');
    } finally {
        await client.close();
    }
}

async function login(req, res) {
    const { email, password } = req.body;

    try {
        await client.connect();
        const database = client.db('myappdb');
        const users = database.collection('users');

        const user = await users.findOne({ email: email });
        if (!user) {
            return res.status(401).send('Invalid email or password');
        }

        const isMatch = await bcrypt.compare(password, user.password);
        if (isMatch) {
            return res.status(200).send('Login successful');
        } else {
            return res.status(401).send('Invalid email or password');
        }
    } catch (error) {
        console.error('Error logging in:', error);
        res.status(500).send('Failed to login');
    } finally {
        await client.close();
    }
}

app.post('/create-account', createAccount);
app.post('/login', login);

app.listen(port, () => {
    console.log(`Server running on port ${port}`);
});


