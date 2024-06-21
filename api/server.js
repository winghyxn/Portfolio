require('dotenv').config();
const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const bcrypt = require('bcrypt');
const { MongoClient, ServerApiVersion } = require('mongodb');
const helmet = require('helmet');

const app = express();
const uri = 'mongodb+srv://kweyne:tfaoAz9bCAuXWwpD@orbital.fmsrize.mongodb.net/?retryWrites=true&w=majority&appName=orbital'; // Ensure this variable is set in your .env file
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

// Connect to MongoDB
async function connectToMongoDB() {
  try {
    await client.connect();
    console.log('MongoDB connected');
  } catch (error) {
    console.error('MongoDB connection error:', error);
    process.exit(1); // Exit process on connection error
  }
}

connectToMongoDB();

// Error handler for MongoDB client
client.on('error', (err) => {
  console.error('MongoDB client error:', err);
  client.close();
  process.exit(1); // Exit process on client error
});

// Define routes and MongoDB collections

// Example route for handling user account creation
app.post("/create-account", async (req, res) => {
  const { email, password } = req.body;

  try {
    const hashedPassword = await bcrypt.hash(password, 10);
    const database = client.db('bumbledore');
    const users = database.collection('userAccountInfo');

    const existingUser = await users.findOne({ email: email });
    if (existingUser) {
      return res.status(400).send('Email already exists');
    }

    const result = await users.insertOne({ "email": email, "password": hashedPassword });
    res.status(200).send('Account created successfully');
  } catch (error) {
    console.error('Error creating account:', error);
    res.status(500).send('Failed to create account');
  }
});

// Example route for handling user login
app.post('/login', async (req, res) => {
  const { email, password } = req.body;

  try {
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
  }
});

// Example route for handling post creation
app.post('/posts', async (req, res) => {
  const { userId, typeOfRequest, courseCode, pay, numGroupmates, description } = req.body;

  try {
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
    res.status(201).json(result.ops[0]); // Return the inserted post
  } catch (error) {
    console.error('Error creating post:', error);
    res.status(500).send('Failed to create post');
  }
});

// Start the server
app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});
