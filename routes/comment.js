var express = require("express");
var router = express.Router();
var Camp = require("../models/camp");
var Comment = require("../models/comment");
var middleObj = require("../middleware/index");
var multer = require("multer");
var upload = multer().array();

// Show the form to add new comment to selected camp
router.get("/camp/:id/comment/new", middleObj.isLoggedIn, function(req,res){
   Camp.findById(req.params.id, function(err, foundCamp){
       if (err){
           req.flash("error", err.message);
           res.redirect("/");
       } else {
           res.render("newCom", {foundCamp: foundCamp});
       }
   }); 
});

// add new comment
router.post("/camp/:id/comment", middleObj.isLoggedIn, function(req,res){
   Camp.findById(req.params.id, function(err, foundCamp){
       if (err){
           req.flash("error", err.message);
           res.redirect("/camp/" + req.params.id);
       } else {
           upload(req,res,function(err){
               if (err) {
                   return res.end("Error uploading comment.");
               } else {
                   Comment.create(req.body.comment, function(err, newCom){
                       if (err){
                           req.flash("error", err.message);
                           res.redirect("/camp/" + req.params.id);
                       } else {
                           //console.log(newCom);
                           newCom.author.id = req.user._id;
                           newCom.author.username = req.user.username;
                           newCom.save();
                           foundCamp.comments.push(newCom);
                           foundCamp.save();
                           res.redirect("/camp/" + req.params.id);
                       }
                   });  
               }
           });
       }
   }); 
});

// show the form to edit comment
router.get("/camp/:id/comment/:commentId/edit", middleObj.checkCommentOwnership, function(req,res){
    Camp.findById(req.params.id, function(err, foundCamp){
       if (err){
           req.flash("error", err.message);
           res.redirect("back");
       } else {
           Comment.findById(req.params.commentId, function(err, foundComment){
               if (err){
                   req.flash("error", err.message);
                   res.redirect("back");
               } else {
                   res.render("editCom", {foundCamp: foundCamp, foundComment: foundComment});
               }
           });
       }
    });
});

// handle edit comment request
router.put("/camp/:id/comment/:commentId", middleObj.checkCommentOwnership, function(req,res){
    upload(req, res, function(err){
        if (err) {
            return res.end("Error editing comment");
        } else {
            Comment.findByIdAndUpdate(req.params.commentId, req.body.com, function(err, updatedCom){
                if (err){
                    req.flash("error", err.message);
                    res.redirect("back");
                } else {
                    res.redirect("/camp/" + req.params.id);
                }
            }); 
        }
    });
});

// delete comment
router.delete("/camp/:id/comment/:commentId", middleObj.checkCommentOwnership, function(req,res){
   Comment.findByIdAndRemove(req.params.commentId, function(err){
      if (err){
          req.flash("error", err.message);
          res.redirect("back");
      } else {
          res.redirect("/camp/" + req.params.id);
      }
   }); 
});

module.exports = router;