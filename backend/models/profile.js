import mongoose from 'mongoose';
const Schema = mongoose.Schema;

const ProfilesSchema = new Schema({
  name: String,
  description: String,
  pictureURL: String
}, { timestamps: true });

export default mongoose.model('Profile', ProfilesSchema);