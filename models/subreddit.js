const mongoose = require('mongoose'),
      passportLocalMongoose = require('passport-local-mongoose');

const SubSchema = new mongoose.Schema({
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
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User'
    }
  ],
  admin: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  },
  ageRestricted: Boolean
})

SubSchema.plugin(passportLocalMongoose);

module.exports = mongoose.model('Sub', SubSchema);
