const mongoose = require('mongoose');

const PostSchema = new mongoose.Schema({
  title: {type: String, required: true},
  body: String,
  author: {type: String, required: true},
  sub: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Sub'
  },
  comments: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Comment'
    }
  ],
  votes: {
    up: {type: Number, default: 0},
    down: {type: Number, default: 0}
  }
})

module.exports = mongoose.model('Post', PostSchema);
