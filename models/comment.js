const mongoose = require('mongoose');

const CommentSchema = new mongoose.Schema({
  body: String,
  post: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Post'
  },
  author: String,
  votes: {
    up: Number,
    down: Number
  }
})

module.exports = mongoose.model('Comment', CommentSchema);
