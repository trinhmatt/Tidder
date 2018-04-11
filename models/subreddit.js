const mongoose = require('mongoose'),
      passportLocalMongoose = require('passport-local-mongoose');

const SubtidderSchema = new mongoose.Schema({
  name: String,
  description: String,
  posts: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Post'
    }
  ],
  mods: [
    {
      id: {
        type: mongoose.Schema.Types.ObjectId.
        ref: 'User'
      }
    }
  ],
  ageRestricted: Boolean
})

Subtidder.plugin(passportLocalMongoose);

module.exports = mongoose.model('Subtidder', SubtidderSchema);
