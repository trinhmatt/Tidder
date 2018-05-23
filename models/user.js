const mongoose = require('mongoose'),
      passportLocalMongoose = require('passport-local-mongoose');

const UserSchema = new mongoose.Schema({
  username: String,
  password: String,
  subs: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Sub'
    }
  ],
  //Keep track of voted posts so user can only vote once
  //Post = postID,
  //Vote = 1 for upvote and -1 for downvote
  votedPosts: [{
    post: String,
    vote: Number
  }],
  savedPosts: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Post'
  }]
})

UserSchema.plugin(passportLocalMongoose);

module.exports = mongoose.model('User', UserSchema);
