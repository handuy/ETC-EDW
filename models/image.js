// SCHEMA SETUP
var mongoose = require("mongoose");

var thumbnailPluginLib = require('mongoose-thumbnail');
var thumbnailPlugin = thumbnailPluginLib.thumbnailPlugin;
var make_upload_to_model = thumbnailPluginLib.make_upload_to_model;

var imageSchema = new mongoose.Schema({
    title: String,
    author: {
      id: {
         type: mongoose.Schema.Types.ObjectId,
         ref: "User"
      },
      username: String
   }
});

imageSchema.plugin(thumbnailPlugin, {
    name: "photo",
    inline: true
});

module.exports = mongoose.model("Image", imageSchema);