// SCHEMA SETUP
var mongoose = require("mongoose");

var campSchema = new mongoose.Schema({
   name: String,
   thumbnailImage: String,
   fullImage: String,
   description: String,
   author: {
      id: {
         type: mongoose.Schema.Types.ObjectId,
         ref: "User"
      },
      username: String
   },
   comments: [
      {
         type: mongoose.Schema.Types.ObjectId,
         ref: "Comment"
      }
   ]
});

module.exports = mongoose.model("Camp", campSchema);