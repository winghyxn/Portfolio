const express = require('express');
const bodyParser = require('body-parser');
const bcrypt = require('bcrypt');
const cors = require('cors');
const { MongoClient } = require('mongodb');

const app = express();
const port = 8080;

const uri = "mongodb+srv://kweyne:tfaoAz9bCAuXWwpD@orbital.fmsrize.mongodb.net/?retryWrites=true&w=majority&appName=orbital";
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true });

app.use(bodyParser.json());
app.use(cors());

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

function generateUsername() {
  const adjective = adjectives[Math.floor(Math.random() * adjectives.length)];
  const animal = animals[Math.floor(Math.random() * animals.length)];
  return `${adjective}${animal}`;
}

async function isUsernameTaken(username, collection) {
  const existingUser = await collection.findOne({ username });
  return !!existingUser;
}

async function generateUniqueUsername(usersCollection) {
  let username = generateUsername();
  while (await isUsernameTaken(username, usersCollection)) {
    username = generateUsername();
  }
  return username;
}


app.post('/create-account', async (req, res) => {
  const { email, password } = req.body;

  try {
    const hashedPassword = await bcrypt.hash(password, 10);
    await client.connect();
    const database = client.db('bumbledore');
    const users = database.collection('userAccountInfo');
    const profiles = database.collection('userProfileInfo');

    let username = await generateUniqueUsername(users);

    await users.insertOne({
      email: email,
      username: username,
      password: hashedPassword
    });

    await profiles.insertOne({
      email: email,
      username: username
    });

    res.status(200).send('Account created successfully');
  } catch (error) {
    console.error('Error creating account:', error);
    res.status(500).send('Failed to create account');
  } finally {
    await client.close();
  }
});

app.post('/login', async (req, res) => {
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
      return res.status(200).send({ token: user.username });
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

app.post('/my-profile', async (req, res) => {
  const { username, year, major, description } = req.body;

  try {
    await client.connect();
    const database = client.db('bumbledore');
    const profiles = database.collection('userProfileInfo');

    const hasProfile = await profiles.findOne({ username: username });
    if (hasProfile) {
      await profiles.replaceOne(
        { username: username },
        { username, year, major, description }
      );
    } else {
      await profiles.insertOne({ username, year, major, description });
    }
    res.status(200).send('Profile edited successfully');
  } catch (error) {
    console.error('Error editing profile:', error);
    res.status(500).send('Failed to edit profile');
  } finally {
    await client.close();
  }
});

app.get('/my-profile', async (req, res) => {
  const username = req.query.username;
  
  try {
    await client.connect();
    const db = client.db("bumbledore");
    const profiles = db.collection("userProfileInfo");

    const profile = await profiles.findOne({ username: username });
    res.status(200).json(profile);
  } catch (error) {
    console.error('Error fetching posts:', error);
    res.status(500).send('Failed to fetch posts');
  } finally {
    await client.close();
  }
});

app.get('/posts', async (req, res) => {
  try {
    await client.connect();
    const database = client.db('bumbledore');
    const posts = database.collection('posts');
    const allPosts = await posts.find({}).toArray();
    res.status(200).json(allPosts);
  } catch (error) {
    console.error('Error fetching posts:', error);
    res.status(500).send('Failed to fetch posts');
  } finally {
    await client.close();
  }
});

app.post('/create-post', async (req, res) => {
  const { typeOfRequest, courseCode, description, pay, numGroupmates, username } = req.body;

  try {
      await client.connect();
      const database = client.db('bumbledore');
      const posts = database.collection('posts');

      const post = {
          typeOfRequest,
          courseCode,
          description,
          pay: typeOfRequest === 'lookingForTutor' ? pay : undefined,
          numGroupmates: typeOfRequest === 'lookingForGroupmate' ? numGroupmates : undefined,
          createdAt: new Date(),
          username, // Add the username to the post
      };

      await posts.insertOne(post);

      res.status(200).send('Post created successfully');
  } catch (error) {
      console.error('Error creating post:', error);
      res.status(500).send('Failed to create post');
  } finally {
      await client.close();
  }
});

app.get('/user-profile', async (req, res) => {
  const username = req.query.username;
  try {
      await client.connect();
      const db = client.db("bumbledore");
      const profiles = db.collection("userProfileInfo");

      const profile = await profiles.findOne({ username: username });
      if (!profile) {
          return res.status(404).send('User profile not found');
      }
      res.status(200).json(profile);
  } catch (error) {
      console.error('Error fetching profile:', error);
      res.status(500).send('Failed to fetch profile');
  } finally {
      await client.close();
  }
});

app.listen(port, () => {
  console.log(`Server running on http://localhost:${port}`);
});

