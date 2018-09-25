var express    = require("express");
var router     = express.Router({mergeParams: true});
var Garment    = require("../models/garments")
var Comment    = require("../models/comment");
var middleware = require("../middleware")

/// NEW ROUTE
router.get("/new", middleware.isLoggedIn, function(req,res){
    // find garment by id
    Garment.findById(req.params.id, function(err,garment){
        if(err){
            console.log(err);
        } else {
            res.render("comments/new", {garment: garment});
        }
    })
});


// CREATE ROUTE
router.post("/", middleware.isLoggedIn, function(req,res){
    // look up garment using ID
    Garment.findById(req.params.id, function(err, garment){
        if(err){
            console.log(err);
            res.redirect("/garments");
        } else {
            // by packaging up all the comment data from the form into comment[author], comment[title]
            // we can just pass 'req.body.comment' into the create function
            // instead of doing var title = req.body.title
            //                  var author = req.body.author
            // var newComment = {title: title, author: author}
            // then passing newComment into create function
            Comment.create(req.body.comment, function(err, comment){
                if(err){
                    req.flash("error", "Something went wrong");
                } else {
                    // add username and id to comment
                    comment.author.id = req.user._id;
                    comment.author.username = req.user.username;
                    // save comment
                    comment.save();

                    garment.comments.push(comment);
                    garment.save();
                    
                    req.flash("success", "Successfully added comment");
                    res.redirect("/garments/" + garment._id);
                }
            })
        }
    });
})

// EDIT COMMENT ROUTE
router.get("/:comment_id/edit", middleware.checkCommentOwnership, function(req,res){
    Comment.findById(req.params.comment_id, function(err, foundComment){
        if(err){
            res.redirect("back");
        } else {
            res.render("comments/edit", {garment_id: req.params.id, comment:foundComment});
        }
    })
});

// UPDATE COMMENT ROUTE
router.put("/:comment_id", middleware.checkCommentOwnership, function(req,res){
    Comment.findByIdAndUpdate(req.params.comment_id, req.body.comment, function(err, updatedComment){
        if(err){
            res.redirect("back");
        } else {
            res.redirect("/garments/" + req.params.id);
        }
    })
});

// COMMENT DESTROY ROUTE
router.delete("/:comment_id", middleware.checkCommentOwnership, function(req,res){
    Comment.findByIdAndRemove(req.params.comment_id, function(err){
        if(err){
            res.redirect("back");
        } else {
            req.flash("success", "Comment deleted!");
            res.redirect("/garments/" + req.params.id);
        }
    })
})


module.exports = router;