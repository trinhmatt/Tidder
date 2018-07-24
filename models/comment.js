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
  //Cant make a ref here, since it wouldn't work for deeply nested replies
  //Have to push the whole reply as is, costly but necessary 
    //I'd have to keep populating the replies it would take too long
  replies: [],
  // moment format for creation date => moment().format('MMMM Do YYYY, h:mm:ss a')
  dateCreated: String
})

module.exports = mongoose.model('Comment', CommentSchema);
