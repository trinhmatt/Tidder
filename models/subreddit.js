const mongoose = require('mongoose');

const SubSchema = new mongoose.Schema({
  name: {type: String, unique: true, required: true, dropDups: true},
  description: String,
  posts: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Post'
    }
  ],
  admin: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  },
  blockedUsers: mongoose.Schema.Types.Mixed,
  mods: [],
  ageRestricted: Boolean,
  permittedPosts: Object,
  isDefault: Boolean,
  isPrivate: Boolean,
  subKey: String
}, {minimize: false})

module.exports = mongoose.model('Sub', SubSchema);
