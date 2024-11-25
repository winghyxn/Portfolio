const express = require('express');
const bodyParser = require('body-parser');
const bcrypt = require('bcrypt');
const cors = require('cors');
const { MongoClient, ObjectId } = require('mongodb');

const app = express();
const port = 8080;

const uri = "mongodb+srv://kweyne:tfaoAz9bCAuXWwpD@orbital.fmsrize.mongodb.net/?retryWrites=true&w=majority&appName=orbital";
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true });
const allowedOrigins = [
  process.env.FRONTEND_URL, 
  'https://bumbledore.vercel.app',
  'https://api-wing-s-projects.vercel.app', 
  'https://orbital-wing-s-projects.vercel.app',
  'https://bumbledore-git-weien-branch-kohweiens-projects.vercel.app',
  'https://orbital-git-main-winghyxn-wing-s-projects.vercel.app',
  'https://api.vercel.app'
]; 
const corsOptions = { 
  origin: '*',
  methods: 'GET, POST, PUT, PATCH, DELETE, OPTIONS',
  allowedHeaders: 'Content-Type, Authorization'
};

app.use(bodyParser.json());
app.use(cors(corsOptions));


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

app.get('/', async(req, res) => {
  res.send('hello!');
});

app.post('/create-account', async (req, res) => {
  const { email, password } = req.body;

  try {
    const hashedPassword = await bcrypt.hash(password, 10);
    await client.connect();
    const database = client.db('bumbledore');
    const users = database.collection('userAccountInfo');
    const profiles = database.collection('userProfileInfo');

    let username = await generateUniqueUsername(users);

    const user = await users.findOne({ email: email });

    if (!user) {
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

    } else {
      res.status(400).send('User already exists')
    }
  } catch (error) {
    console.error('Error creating account:', error);
    res.status(500).send('Failed to create account');
  } finally {
    await client.close();
  }
});

app.options('/login', cors(corsOptions));

app.post('/login', async (req, res) => {
  const { email, password } = req.body;
  try {
    await client.connect();
    const db = client.db("bumbledore");
    const users = db.collection("userAccountInfo");

    const user = await users.findOne({ email: email });
    if (!user) {
      return res.status(401).send({ error: 'User not found'});
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (isMatch) {
      return res.status(200).send({ token: user.username });
    } else {
      return res.status(401).send({ error: 'Invalid email or password'});
    }
  } catch (error) {
    res.status(500).send({ error: 'Failed to login'});
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
    res.status(200).json({ username, year, major, description });
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
    const openPosts = await posts.find({ status: 'Open' }).toArray();
    res.status(200).json(openPosts);
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
      username,
      status: 'Open',
      applicants: [],
      clickCounts: {  // Initialize clickCounts here
        messageClicks: 0,
        applyClicks: 0,
        usernameClicksHome: 0,
        usernameClicksApps: 0,
        usernameClicksMessages: 0        
      }
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
      //if (!profile) {
      //    return res.status(404).send('User profile not found');
      //}
      res.status(200).json(profile);
  } catch (error) {
      console.error('Error fetching profile:', error);
      res.status(500).send('Failed to fetch profile');
  } finally {
      await client.close();
  }
});


app.post('/new-chat', async (req, res) => {
  const { username, profile, postID } = req.body;

  try {
      await client.connect();
      const database = client.db('bumbledore');
      const allChats = database.collection('chats');

      const selfHasChats = await allChats.findOne({ username: username });
      const otherHasChats = await allChats.findOne({ username: profile });

      if (!selfHasChats) {
        await allChats.insertOne({
          username: username,
          chats: []
        });
      }

      if (!otherHasChats) {
        await allChats.insertOne({
          username: profile, 
          chats: []
        });
      } 

      await allChats.updateOne(
        {username: username},
        {
          $addToSet: {chats: {username: profile, postID: postID}}
      });

      await allChats.updateOne(
        {username: profile}, 
        {
          $addToSet: {chats: {username: username, postID: postID}}
      });

      res.status(200).send("Successfully updated chats");
  } catch (error) {
      console.error('Error updating chats:', error);
      res.status(500).send('Failed to update chats');
  } finally {
      await client.close();
  }
});

app.get('/chats', async (req, res) => {
  const username = req.query.username;

  try {
      await client.connect();
      const db = client.db("bumbledore");
      const allChats = db.collection("chats");

      const chats = await allChats.findOne({ username: username });
      res.status(200).json(chats);
  } catch (error) {
      console.error('Error fetching chats:', error);
      res.status(500).send('Failed to fetch chats');
  } finally {
      await client.close();
  }
});


app.post('/messages', async (req, res) => {
  const { sender, recipient, message, postID } = req.body; // Include postID in the destructuring

  try {
      await client.connect();
      const database = client.db('bumbledore');
      const allMessages = database.collection('messages');

      const messageInfo = {
        sender: sender,
        recipient: recipient,
        postID: postID, // Add postID to the message document
        message: message,
        createdAt: new Date(),
      };

      await allMessages.insertOne(messageInfo);

      res.status(200).send({ messageInfo });
  } catch (error) {
      console.error('Error sending message:', error);
      res.status(500).send('Failed to send message');
  } finally {
      await client.close();
  }
});

app.get('/messages', async (req, res) => {
  const sender = req.query.sender;
  const recipient = req.query.recipient;
  const postID = req.query.postID;

  try {
      await client.connect();
      const db = client.db("bumbledore");
      const allMessages = db.collection("messages");

      const sort = { createdAt: 1 };
      const messages = await allMessages.find({
        $and: [
          { postID: postID },
          {
            $or: [
              { $and: [{ sender: sender }, { recipient: recipient }] },
              { $and: [{ sender: recipient }, { recipient: sender }] }
            ]
          }
        ]
      }).sort(sort).toArray();
      res.status(200).json(messages);
  } catch (error) {
      console.error('Error fetching messages:', error);
      res.status(500).send('Failed to fetch messages');
  } finally {
      await client.close();
  }
});

app.get('/posts/my-posts', async (req, res) => {
  const { username } = req.query;

  try {
    await client.connect();
    const database = client.db('bumbledore');
    const posts = database.collection('posts');
    const myPosts = await posts.find({ username }).toArray();
    res.status(200).json(myPosts);
  } catch (error) {
    console.error('Error fetching my posts:', error);
    res.status(500).send('Failed to fetch my posts');
  } finally {
    await client.close();
  }
});

app.patch('/posts/:id/close', async (req, res) => {
  const { id } = req.params;

  try {
      await client.connect();
      const database = client.db('bumbledore');
      const posts = database.collection('posts');

      const result = await posts.updateOne({ _id: new ObjectId(id) }, { $set: { status: 'closed' } });

      if (result.modifiedCount === 1) {
          res.status(200).send('Post closed successfully');
      } else {
          res.status(404).send('Post not found');
      }
  } catch (error) {
      console.error('Error closing post:', error);
      res.status(500).send('Failed to close post');
  } finally {
      await client.close();
  }
});

app.patch('/posts/:id/apply', async (req, res) => {
  const { id } = req.params;
  const { username } = req.body;

  try {
      await client.connect();
      const database = client.db('bumbledore');
      const posts = database.collection('posts');

      const result = await posts.updateOne(
          { _id: new ObjectId(id) },
          { $addToSet: { applicants: username } }
      );

      if (result.modifiedCount === 1) {
          res.status(200).send('Applied successfully');
      } else {
          res.status(404).send('Post not found');
      }
  } catch (error) {
      console.error('Error applying to post:', error);
      res.status(500).send('Failed to apply to post');
  } finally {
      await client.close();
  }
});

app.get('/posts/my-applications', async (req, res) => {
  const { username } = req.query;

  try {
    await client.connect();
    const database = client.db('bumbledore');
    const posts = database.collection('posts');

    console.log(`Fetching applications for username: ${username}`);

    const myApplications = await posts.find({
      $or: [
        { applicants: { $exists: true, $elemMatch: { $eq: username } } },
        { acceptedApplicant: username }
      ]
    }).toArray();

    console.log(`Found applications: ${JSON.stringify(myApplications)}`);

    res.status(200).json(myApplications);
  } catch (error) {
    console.error('Error fetching my applications:', error);
    res.status(500).send('Failed to fetch my applications');
  } finally {
    await client.close();
  }
});


app.get('/posts/reviewable-posts', async (req, res) => {
  const first = req.query.first;
  const second = req.query.second;
  try {
    await client.connect();
    const database = client.db('bumbledore');
    const posts = database.collection('posts');
    const reviewablePosts = await posts.find({
      $or: [
        { username: first, acceptedApplicant: second, status: "Successful" }, 
        { username: second, acceptedApplicant: first, status: "Successful" }
      ]
    })
    .project({ _id: 1 })
    .toArray();

    res.status(200).json(reviewablePosts);
  } catch (error) {
    console.error('Error fetching reviewable posts:', error);
    res.status(500).send('Failed to fetch reviewable posts');
  } finally {
    await client.close();
  }
});


app.patch('/posts/:id/accept', async (req, res) => {
  const { id } = req.params;
  const { applicant } = req.body;

  try {
      await client.connect();
      const database = client.db('bumbledore');
      const posts = database.collection('posts');

      const post = await posts.findOne({ _id: new ObjectId(id) });

      if (!post) {
          res.status(404).send('Post not found');
          return;
      }

      // Update post status to 'Successful' and set the accepted applicant
      const result = await posts.updateOne(
          { _id: new ObjectId(id) },
          { 
              $set: { 
                  status: 'Successful', 
                  acceptedApplicant: applicant 
              }
          }
      );

      // Set status 'closed' for all non-accepted applicants
      await posts.updateMany(
          { _id: new ObjectId(id), 'applicants': { $ne: applicant } },
          { $set: { 'applicants.$[elem].status': 'closed' } },
          { arrayFilters: [{ 'elem': { $ne: applicant } }] }
      );

      if (result.modifiedCount === 1) {
          res.status(200).send('Applicant accepted successfully');
      } else {
          res.status(404).send('Post not found');
      }
  } catch (error) {
      console.error('Error accepting applicant:', error);
      res.status(500).send('Failed to accept applicant');
  } finally {
      await client.close();
  }
});


app.post('/reviews', async (req, res) => {
  const { postID, rating, text, reviewer, reviewee } = req.body;
  const review = {
    postID,
    rating,
    text,
    reviewer,
    reviewee,
    createdAt: new Date(),
  };

  try {
    await client.connect();
    const db = client.db('bumbledore');
    const reviews = db.collection('reviews');
    const existingReview = await reviews.findOne({ postID: postID});

    if (existingReview) {
      await reviews.replaceOne(
        { postID: postID },
        review
      );
    } else {
      await reviews.insertOne(review);
    }
    res.status(200).json(review);
  } catch (error) {
    console.error('Error submitting review:', error);
    res.status(500).send('Failed to submit review');
  } finally {
    await client.close();
  }
});

app.get('/reviews', async (req, res) => {
  const username = req.query.username;

  try {
    await client.connect();
    const db = client.db('bumbledore');
    const reviews = db.collection('reviews');
    const userReviews = await reviews.find({ reviewee: username }).toArray();
    res.status(200).json(userReviews);
  } catch (error) {
    console.error('Error fetching reviews:', error);
    res.status(500).send('Failed to fetch reviews');
  } finally {
    await client.close();
  }
});

app.post('/clicks/:postId', async (req, res) => {
  const { postId } = req.params;
  const { type } = req.body;

  try {
      if (!['messageClicks', 'applyClicks', 'usernameClicksHome', 'usernameClicksApps', 'usernameClicksMessages'].includes(type)) {
          return res.status(400).json({ error: 'Invalid click type' });
      }

      await client.connect();
      const database = client.db('bumbledore');
      const posts = database.collection('posts');

      // Convert postId to ObjectId
      const postObjectId = new ObjectId(postId);

      // Find the post
      const post = await posts.findOne({ _id: postObjectId });
      if (!post) {
          return res.status(404).json({ error: 'Post not found' });
      }

      // Update the clickCounts
      const updatedClickCounts = {
          ...post.clickCounts,
          [type]: (post.clickCounts?.[type] || 0) + 1
      };

      await posts.updateOne(
          { _id: postObjectId },
          { $set: { clickCounts: updatedClickCounts } }
      );

      res.status(200).json({ message: `Incremented ${type} count` });
  } catch (error) {
      console.error(`Error incrementing ${type} count for post ${postId}:`, error);
      res.status(500).json({ error: 'Failed to increment click count' });
  } finally {
      await client.close();
  }
});


// Retrieve click data
app.get('/clicks/:postId', async (req, res) => {
  const { postId } = req.params;

  try {
      const postObjectId = new ObjectId(postId);

      await client.connect();
      const database = client.db('bumbledore');
      const posts = database.collection('posts');

      const post = await posts.findOne({ _id: postObjectId });
      if (!post) {
          return res.status(404).json({ error: 'Post not found' });
      }
      const clickCounts = post.clickCounts || { 
          messageClicks: 0, 
          applyClicks: 0, 
          usernameClicksHome: 0,
          usernameClicksApps: 0,
          usernameClicksMessages: 0
      };
      const usernameClicks = clickCounts.usernameClicksHome + clickCounts.usernameClicksApps + clickCounts.usernameClicksMessages;
      res.status(200).json({
          ...clickCounts,
          usernameClicks
      });
  } catch (error) {
      console.error('Error retrieving click data:', error);
      res.status(500).json({ error: 'Internal server error' });
  } finally {
      await client.close();
  }
});

// server.js
app.get('/user-clicks/:username', async (req, res) => {
  const { username } = req.params;
  console.log(`Received request for username clicks: ${username}`); // Add this line

  try {
      await client.connect();
      const database = client.db('bumbledore');
      const posts = database.collection('posts');

      const userPosts = await posts.find({ username }).toArray();
      console.log(`User posts: ${JSON.stringify(userPosts)}`); // Add this line

      const totalClicks = userPosts.reduce((acc, post) => {
          const { clickCounts } = post;
          acc.usernameClicksHome += clickCounts?.usernameClicksHome || 0;
          acc.usernameClicksApps += clickCounts?.usernameClicksApps || 0;
          acc.usernameClicksMessages += clickCounts?.usernameClicksMessages || 0;
          return acc;
      }, {
          usernameClicksHome: 0,
          usernameClicksApps: 0,
          usernameClicksMessages: 0
      });

      res.status(200).json({ totalClicks, userPosts });
  } catch (error) {
      console.error('Error retrieving user click data:', error);
      res.status(500).json({ error: 'Internal server error' });
  } finally {
      await client.close();
  }
});

app.listen(port, () => {
  console.log(`Server running on http://localhost:${port}`);
});

module.exports = app;
