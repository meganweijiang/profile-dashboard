var mongoose = require('mongoose');
const Schema = mongoose.Schema;

const ProfilesSchema = new Schema({
  name: String,
  description: String,
  pictureURL: String
}, { timestamps: true });

var Profile = mongoose.model('Profile', ProfilesSchema);

module.exports = Profile;