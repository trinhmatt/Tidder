const mongoose = require('mongoose');

const PostSchema = new mongoose.Schema({
  title: {type: String, required: true},
  body: {type: String, required: true},
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
  ]
})

module.exports = mongoose.model('Post', PostSchema);
