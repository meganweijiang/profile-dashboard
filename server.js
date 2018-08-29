var express = require('express');
var bodyParser = require('body-parser');
var logger = require('morgan');
var mongoose = require('mongoose');
var Profile = require('./models/profile');

// Create instances
const app = express();
const router = express.Router();

// User predetermined port or 3001
const API_PORT = process.env.PORT || 3001;

// Connect to DB
mongoose.connect(process.env.MONGO_URI);
var db = mongoose.connection;
db.on('error', console.error.bind(console, 'MongoDB connection error:'));

app.use(express.static("client/build"));

// Look for JSON data 
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
app.use(logger('dev'));

// Set route path and initialize API
router.get('/', (req, res) => {
  res.json({ message: 'Hello, World!' });
});

router.get('/profiles', (req, res) => {
  Profile.find({}).sort('-createdAt').exec(function(err, profiles) {
    if (err) return res.json({ success: false, error: err });
    return res.json({ success: true, data: profiles });
  });
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

app.listen(API_PORT, "0.0.0.0", function() {
  console.log("Listening on Port 3001");
});