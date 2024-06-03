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

app.post("/login", async (req, res) => {
    const { email, password } = req.body;

    try {
        await client.connect();
        const db = client.db("bumbledore");
        const users = db.collection("userAccountInfo");

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
});

module.exports = app;