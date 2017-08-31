var express = require("express");
//var fs = require("fs");
//var path = require("path");
var router = express.Router();
var Camp = require("../models/camp");
var middleObj = require("../middleware/index");
//var multer = require("multer");


// Show all the camps
router.get("/camp", function(req,res){
    Camp.find({}, function(err,allCamp){
       if (err) {
           req.flash("error", err.message);
           res.redirect("/");
       } else {
           res.render("index", {camp: allCamp});
       }
    });
});

// handle add new camp post request
router.post("/camp", middleObj.isLoggedIn, function(req,res){
    var newName = req.body.name;
    var newImageUrl = req.body.image;
    var newDesc = req.body.description;
    var author = {
        id: req.user._id,
        username: req.user.username
    };
    var newCamp = {name: newName, imageUrl: newImageUrl, description: newDesc, author: author};
    Camp.create(newCamp, function(err, newData){
        if (err){
            req.flash("error", err.message);
            res.redirect("/");
        } else {
            res.redirect("/camp");
        }
    });
});

// Show form to add new camp
router.get("/camp/new", middleObj.isLoggedIn, function(req,res){
   res.render("new"); 
});

// show more info about one camp
router.get("/camp/:id", function(req,res){
   Camp.findById(req.params.id).populate("comments").exec(function(err, selectedCamp){
       if (err){
           req.flash("error", err.message);
           res.redirect("/");
       } else {
           res.render("show", {selectedCamp: selectedCamp});
       }
   });
});

// show the form to edit one camp
router.get("/camp/:id/edit", middleObj.checkCampOwnership, function(req,res){
    Camp.findById(req.params.id, function(err, foundCamp){
        if (err) {
            req.flash("error", err.message);
            res.redirect("/");
        } else {
            res.render("edit", {foundCamp: foundCamp});
        }
    });
});

// handle update camp request
router.put("/camp/:id", middleObj.checkCampOwnership, function(req,res){
   Camp.findByIdAndUpdate(req.params.id, req.body.camp, function(err,updatedCamp){
       if (err) {
           req.flash("error", err.message);
           res.redirect("/");
       } else {
           res.redirect("/camp");
       }
   }); 
});

// handle delete request
router.delete("/camp/:id", middleObj.checkCampOwnership, function(req,res){
   Camp.findByIdAndRemove(req.params.id, function(err){
       if (err){
           req.flash("error", err.message);
           res.redirect("/");
       } else {
           res.redirect("/camp");
       }
   }); 
});

module.exports = router;