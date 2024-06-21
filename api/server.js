require('dotenv').config();
const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const bcrypt = require('bcrypt');
const { MongoClient, ServerApiVersion } = require('mongodb');
const helmet = require('helmet');

const app = express();
const uri = 'mongodb+srv://kweyne:tfaoAz9bCAuXWwpD@orbital.fmsrize.mongodb.net/?retryWrites=true&w=majority&appName=orbital';
const port = process.env.PORT || 8080;

const client = new MongoClient(uri, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  }
});

app.use(bodyParser.json());
app.use(cors());
app.use(helmet());

async function createAccount(req, res) {
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

    await users.insertOne({
      email: email,
      password: hashedPassword
    });
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
    const db = client.db("bumbledore");
    const users = db.collection("userAccountInfo");

    const user = await users.findOne({ email: email });
    if (!user) {
      return res.status(401).send('Invalid email or password');
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (isMatch) {
      return res.status(200).send({ token: "test123" });
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

async function createPost(req, res) {
  const { userId, typeOfRequest, courseCode, pay, numGroupmates, description } = req.body;

  try {
    await client.connect();
    const db = client.db("bumbledore");
    const posts = db.collection("posts");

    const newPost = {
      userId,
      typeOfRequest,
      courseCode,
      pay,
      numGroupmates,
      description,
      createdAt: new Date(),
    };

    const result = await posts.insertOne(newPost);
    res.status(201).json({ id: result.insertedId, ...newPost }); // Return the inserted post
  } catch (error) {
    console.error('Error creating post:', error);
    res.status(500).send('Failed to create post');
  } finally {
    await client.close();
  }
}

app.post("/create-account", createAccount);
app.post('/login', login);
app.post('/posts', createPost);

app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});


// Start the server
app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});
