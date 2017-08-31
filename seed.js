var mongoose = require("mongoose");
var Camp = require("./models/camp");
var Comment = require("./models/comment");

var data = [
    {name: "A", 
    image: "https://farm1.staticflickr.com/112/316612921_f23683ca9d.jpg",
    description: "First blog"
    }
    ,
    {name: "B",
    image: "https://farm7.staticflickr.com/6068/6042217185_89a79dbc00.jpg",
    description: "Second blog"
    }
    ,
    {name: "C",
    image: "https://farm6.staticflickr.com/5319/7407436246_0ac54dd559.jpg",
    description: "Third blog"
    }
];

function seedDB(){
    // Remove all existing data
    Camp.remove({}, function(err){
       if (err){
           console.log(err);
       } /*else {
           data.forEach(function(newData){
              // After remove, create new data
              Camp.create(newData, function(err, newCamp){
                 if (err){
                     console.log(err);
                 } else {
                     Comment.create({text: "Hello new comment", author: "Moe"}, function(err, newCom){
                         if (err){
                             console.log(err);
                         } else {
                             newCamp.comments.push(newCom);
                             newCamp.save();
                         }
                     });
                 }
              }); 
           });
       }*/
    });
}

module.exports = seedDB;