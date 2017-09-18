var express = require("express");
var router = express.Router();
var Camp = require("../models/camp");
var middleObj = require("../middleware/index");
var multer = require("multer");
var Cloudinary = require("cloudinary");

var storage =   multer.diskStorage({
  destination: function (req, file, callback) {
    callback(null, './public/images/uploads');
  },
  filename: function (req, file, callback) {
    callback(null, Date.now() + file.originalname);
  }
});
var upload = multer({storage: storage}).single("image");
var edit = multer({storage: storage}).single("updatedImage");

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
    upload(req,res,function(err) {
        if(err) {
            return res.end("Error uploading file.");
        } else {
            Cloudinary.v2.uploader.upload(req.file.path,
            {api_key: "698891531897437", api_secret: "F75b3U2uSX2cjlF6xgWi0o_RJBM", 
            cloud_name: "ddgsfbrgm"}, function(err, result) { 
                if(err) {
                    console.log("Error uploading");
                    console.log(err);
                } else {
                    var name = req.body.name;
                    var thumbnailImage = Cloudinary.url(result.public_id + "." + result.format, {
                    cloud_name: "ddgsfbrgm", angle: "exif", quality: "auto:low", height: 218, 
                    crop: "scale"});
                    var fullImage = Cloudinary.url(result.public_id + "." + result.format, {
                    cloud_name: "ddgsfbrgm", angle: "exif"});
                    var description = req.body.description;
                    var author = {
                        id: req.user._id,
                        username: req.user.username
                    };
                    var newCamp = {name, thumbnailImage, fullImage, description, author};
                    Camp.create(newCamp, function(err, newData){
                        if (err){
                            req.flash("error", err.message);
                            res.redirect("/");
                        } else {
                            res.redirect("/camp");
                        }
                    });        
                }
            });
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
           //console.log(selectedCamp.comments);
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
    edit(req,res,function(err) {
        if (err) {
            res.end(err);
        } else {
            var name = req.body.name;
            var description = req.body.description;    
            if (req.body.image == "updated") {
                Cloudinary.v2.uploader.upload(req.file.path, 
                {api_key: "698891531897437", api_secret: "F75b3U2uSX2cjlF6xgWi0o_RJBM", 
                cloud_name: "ddgsfbrgm"}, function(err, result) {
                    if (err) {
                        return res.end();
                    } else {
                        var thumbnailImage = Cloudinary.url(result.public_id + "." + result.format, {
                            cloud_name: "ddgsfbrgm", angle: "exif", quality: "auto:low", height: 218, 
                            crop: "scale"});
                        var fullImage = Cloudinary.url(result.public_id + "." + result.format, {
                            cloud_name: "ddgsfbrgm", angle: "exif"});
                        var newlyUpdatedCamp = {name, thumbnailImage, fullImage, description};
                        Camp.findByIdAndUpdate(req.params.id, newlyUpdatedCamp, function(err,updatedCamp){
                            if (err) {
                                req.flash("error", err.message);
                                res.redirect("/");
                            } else {
                                res.redirect("/camp/" + updatedCamp._id);
                            }
                        }); 
                    }
                });
            } else {
                var updatedCamp = {name, description};
                Camp.findByIdAndUpdate(req.params.id, updatedCamp, function(err,updatedCamp){
                    if (err) {
                        req.flash("error", err.message);
                        res.redirect("/");
                    } else {
                        res.redirect("/camp/" + updatedCamp._id);
                    }
                }); 
            }
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