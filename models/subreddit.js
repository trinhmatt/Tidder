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
  ageRestricted: Boolean,
  permittedPosts: Object,
  isDefault: Boolean 
})

module.exports = mongoose.model('Sub', SubSchema);
