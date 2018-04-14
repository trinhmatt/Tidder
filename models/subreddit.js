const mongoose = require('mongoose');

const SubSchema = new mongoose.Schema({
  name: String,
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
  ageRestricted: Boolean,
  permittedPosts: Object
})

module.exports = mongoose.model('Sub', SubSchema);
