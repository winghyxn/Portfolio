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

function getRandomElement(arr) {
  return arr[Math.floor(Math.random() * arr.length)];
}

const adjectives = [
  "Silly", "Angry", "Happy", "Sad", "Brave", "Clever", "Curious", "Gentle",
  "Fierce", "Lazy", "Quick", "Slow", "Proud", "Calm", "Loyal", "Wild", "Wise",
  "Kind", "Bold", "Noble", "Bright", "Shy", "Eager", "Mighty", "Cheerful",
  "Friendly", "Grumpy", "Jolly", "Playful", "Quiet", "Thoughtful", "Witty",
  "Zealous", "Adventurous", "Ambitious", "Generous", "Helpful", "Humble",
  "Inquisitive", "Jovial", "Joyful", "Lively", "Patient", "Polite", "Serene",
  "Spirited", "Sturdy", "Vigilant", "Affectionate", "Agile", "Amiable",
  "Artistic", "Assertive", "Attentive", "Benevolent", "Blissful", "Bold",
  "Capable", "Charming", "Chivalrous", "Confident", "Considerate", "Courageous",
  "Daring", "Diligent", "Dynamic", "Earnest", "Efficient", "Energetic",
  "Enthusiastic", "Faithful", "Fearless", "Flexible", "Focused", "Gallant",
  "Gleeful", "Gracious", "Hardworking", "Harmonious", "Honest", "Innovative",
  "Inspirational", "Inventive", "Joyous", "Judicious", "Just", "Keen",
  "Knowledgeable", "Levelheaded", "Luminous", "Masterful", "Meticulous",
  "Motivated", "Observant", "Optimistic", "Passionate", "Perceptive", "Persistent"
];

const animals = [
  "Goose", "Dog", "Cat", "Bear", "Lion", "Tiger", "Wolf", "Fox", "Deer",
  "Elephant", "Leopard", "Giraffe", "Zebra", "Kangaroo", "Panda", "Penguin",
  "Otter", "Rabbit", "Squirrel", "Monkey", "Chimpanzee", "Gorilla", "Hippopotamus",
  "Rhinoceros", "Crocodile", "Alligator", "Turtle", "Tortoise", "Frog", "Toad",
  "Snake", "Lizard", "Eagle", "Hawk", "Falcon", "Owl", "Parrot", "Peacock",
  "Flamingo", "Swan", "Duck", "Chicken", "Rooster", "Turkey", "Pig", "Sheep",
  "Goat", "Cow", "Horse", "Donkey", "Camel", "Bison", "Buffalo", "Moose",
  "Reindeer", "Antelope", "Hyena", "Jackal", "Cheetah", "Cougar", "Bobcat",
  "Lynx", "Ocelot", "Jaguar", "Panther", "Koala", "Sloth", "Armadillo",
  "Porcupine", "Hedgehog", "Mole", "Bat", "Beaver", "Badger", "Weasel",
  "Ferret", "Otter", "Skunk", "Raccoon", "Chipmunk", "Mouse", "Rat", "Hamster",
  "Gerbil", "Guinea Pig", "Chinchilla", "Wombat", "Platypus",
  "Orangutan", "Macaque", "Baboon", "Meerkat", "Aardvark", "Anteater",
  "Echidna", "Okapi", "Caracal", "Serval", "Wolverine", "Opossum", "Capybara"
];

async function createAccount(req, res) {
  const { email, password } = req.body;

  try {
    const hashedPassword = await bcrypt.hash(password, 10);
    await client.connect();
    const database = client.db('bumbledore');
    const users = database.collection('userAccountInfo');
    const profiles = database.collection('userProfileInfo');

    // Check if the email already exists in userAccountInfo
    const existingUser = await users.findOne({ email: email });
    if (existingUser) {
      return res.status(400).send('Email already exists');
    }

    // Generate a random username
    const username = getRandomElement(adjectives) + getRandomElement(animals);

    // Insert into userAccountInfo
    await users.insertOne({
      email: email,
      password: hashedPassword,
      username: username
    });

    // Insert into userProfileInfo
    await profiles.insertOne({
      email: email,
      username: username,
      year: '',        // You can add default values or leave blank
      major: '',       // based on your requirements
      description: ''  // for the profile fields
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
  console.log("Login attempt:", email);
  try {
    await client.connect();
    const db = client.db("bumbledore");
    const users = db.collection("userAccountInfo");

    const user = await users.findOne({ email: email });
    if (!user) {
      console.log("User not found:", email);
      return res.status(401).send('Invalid email or password');
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (isMatch) {
      console.log("Login successful:", email);
      return res.status(200).send({ token: "test123" });
    } else {
      console.log("Password mismatch:", email);
      return res.status(401).send('Invalid email or password');
    }
  } catch (error) {
    console.error('Error logging in:', error);
    res.status(500).send('Failed to login');
  } finally {
    await client.close();
  }
}

async function editProfile(req, res) {
  const { email, year, major, description } = req.body;

  try {
    await client.connect();
    const database = client.db('bumbledore');
    const profiles = database.collection('userProfileInfo');

    const hasProfile = await profiles.findOne({ email: email });
    if (hasProfile) {
      await profiles.replaceOne(
        { email: email },
        { email, year, major, description }
      );
    } else {
      await profiles.insertOne({ email, year, major, description });
    }
    res.status(200).send('Profile edited successfully');
  } catch (error) {
    console.error('Error editing profile:', error);
    res.status(500).send('Failed to edit profile');
  } finally {
    await client.close();
  }
}

async function getProfile(req, res) {
  try {
    await client.connect();
    const database = client.db('bumbledore');
    const profiles = database.collection('userProfileInfo');
    const users = database.collection('userAccountInfo');

    const { email } = req.query;
    console.log('Fetching profile for email:', email);

    const [profileData, userData] = await Promise.all([
      profiles.findOne({ email }),
      users.findOne({ email }, { projection: { username: 1 } })
    ]);

    if (userData) {
      const response = {
        email: userData.email,
        username: userData.username || "", // Ensure username is included
        year: profileData?.year || "",
        major: profileData?.major || "",
        description: profileData?.description || ""
      };
      console.log('Profile data:', response);
      res.status(200).json(response);
    } else {
      res.status(404).send('Profile not found');
    }
  } catch (error) {
    console.error('Error fetching profile:', error);
    res.status(500).send('Failed to fetch profile');
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
    res.status(201).json(result.insertedId); // Return the inserted post ID
  } catch (error) {
    console.error('Error creating post:', error);
    res.status(500).send('Failed to create post');
  } finally {
    await client.close();
  }
}

async function getPosts(req, res) {
  try {
    await client.connect();
    const db = client.db("bumbledore");
    const posts = db.collection("posts");

    const allPosts = await posts.find({}).toArray();
    res.status(200).json(allPosts);
  } catch (error) {
    console.error('Error fetching posts:', error);
    res.status(500).send('Failed to fetch posts');
  } finally {
    await client.close();
  }
}

app.post("/create-account", createAccount);
app.post('/login', login);
app.post('/my-profile', editProfile);
app.get('/my-profile', getProfile); // Add this line to handle profile fetching
app.post('/posts', createPost);
app.get('/posts', getPosts);

app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});
