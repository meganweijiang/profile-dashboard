const express = require('express');
const bodyParser = require('body-parser');
const logger = require('morgan');
const mongoose = require('mongoose');
const Profile = require('./models/profile');
const dotenv = require('dotenv');
const { ReplSet } = require('mongodb-topology-manager');

// Create instances
const app = express();
const router = express.Router();

const http = require("http").createServer(app);
const io = require("socket.io")(http, { origins: '*:*'});
dotenv.config();

// User predetermined port or 3001
const API_PORT = process.env.PORT || 3001;

const uri = process.env.MONGO_URI;
// Connect to DB
mongoose.connect(uri, { useNewUrlParser: true });
const db = mongoose.connection;
db.on('error', console.error.bind(console, 'MongoDB connection error:'));

app.use(express.static("client/build"));

// Look for JSON data 
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
app.use(logger('dev'));

io.on("connection", (socket) => {
  console.log("New client connected" + socket.id);
  getProfiles(io.sockets);

  socket.on("disconnect", () => {
    console.log("user disconnected");
  });

  socket.on("data_changed", () => {
    getProfiles(io.sockets);
  })
});

const getProfiles = (sockets) => {
  Profile.find({}).sort('-createdAt').exec(function(err, profiles) {
    if (err) return res.json({ success: false, error: err });
    return sockets.emit("get_data", profiles);
  });
}

// Set route path and initialize API
router.get('/', (req, res) => {
  res.json({ message: 'Hello, World!' });
});


router.post('/profiles', (req, res) => {
  const profile = new Profile();
  const { name, description, pictureURL } = req.body;
  if ( !name || !description || !pictureURL ) {
    return res.json({
      success: false,
      error: 'You must provide a name, description, and picture'
    });
  }
  profile.name = name;
  profile.description = description;
  profile.pictureURL = pictureURL;
  profile.save(err => {
    if (err) return res.json({ success: false, error: err });
    return res.json({ success: true });
  });
});

router.put('/profiles/:profileId', (req, res) => {
  const { profileId } = req.params;
  if (!profileId) {
    return res.json({ success: false, error: 'No profile id provided' });
  }
  Profile.findById(profileId, (error, profile) => {
    if (error) return res.json({ success: false, error });
    const { name, description, pictureURL } = req.body;
    if (name) profile.name = name;
    if (description) profile.description = description;
    if (pictureURL) profile.pictureURL = pictureURL;
    profile.save(error => {
      if (error) return res.json({ success: false, error });
      return res.json({ success: true });
    });
  });
});

app.use('/api', router);

http.listen(API_PORT, "127.0.0.1", function() {
  console.log(`Listening on Port ${API_PORT}`);
});

async function setupReplicaSet() {
  const bind_ip = 'localhost';
  // Starts a 3-node replica set on ports 31000, 31001, 31002, replica set
  // name is "rs0".
  const replSet = new ReplSet('mongod', [
    { options: { port: 31000, dbpath: `${__dirname}/data/db/31000`, bind_ip } },
    { options: { port: 31001, dbpath: `${__dirname}/data/db/31001`, bind_ip } },
    { options: { port: 31002, dbpath: `${__dirname}/data/db/31002`, bind_ip } }
  ], { replSet: 'rs0' });

  // Initialize the replica set
  await replSet.purge();
  await replSet.start();
  console.log(new Date(), 'Replica set started...');
}