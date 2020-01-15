var mongoose = require('mongoose');

let commentSchema = new mongoose.Schema({
  text: String,
  author: {
    id: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User" // refers to models
    },
    username: String
  }
});

module.exports = mongoose.model('Comment', commentSchema);