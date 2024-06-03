require('dotenv').config();
const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const bcrypt = require('bcrypt');
const { MongoClient, ServerApiVersion } = require('mongodb');
const helmet = require('helmet');

const app = express();
const uri = process.env.MONGODB_URI;
//const uri = "mongodb+srv://kweyne:tfaoAz9bCAuXWwpD@orbital.fmsrize.mongodb.net/?retryWrites=true&w=majority&appName=orbital";
const port = 3000 || process.env.PORT;
const client = new MongoClient(uri, { useUnifiedTopology: true });

/*const client = new MongoClient(uri, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  }
});*/

app.use(bodyParser.json());
app.use(cors());
app.use(helmet());

app.post("create-account", async (req, res) => {
    const { email, password } = req.body;

    try {
        const hashedPassword = await bcrypt.hash(password, 10);
        await client.connect();
        const database = client.db('bumbledore');
        const users = database.collection('userAccountInfo');

        const existingUser = await users.findOne({ email: email });
        if (existingUser) {
            return res.status(400).send('Email already exists');
        }

        const result = await users.insertOne(
            { 
            "email": email, 
            "password": hashedPassword }
        );
        res.status(200).send('Account created successfully');
    } catch (error) {
        console.error('Error creating account:', error);
        res.status(500).send('Failed to create account');
    } finally {
        await client.close();
    }
})

module.exports = createAccount;