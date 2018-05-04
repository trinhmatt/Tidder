const mongoose = require('mongoose');

const CommentSchema = new mongoose.Schema({
  body: String,
  post: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Post'
  },
  author: String,
  votes: {
    up: {type: Number, default: 0},
    down: {type: Number, default: 0}
  },
  dateCreated: String
})

module.exports = mongoose.model('Comment', CommentSchema);
