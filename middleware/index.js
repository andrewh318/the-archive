var Garment = require("../models/garments");
var Comment = require("../models/comment");

// all the middleware goes here
var middlewareObj = {};
// adding all these functions to the middle ware object
middlewareObj.checkGarmentOwnership = function (req, res, next) {
    // is user logged in
    if (req.isAuthenticated()) {
        // does user own garment
        Garment.findById(req.params.id, function (err, foundGarment) {
            // if there is an error or if foundGarment is null
            if (err || !foundGarment) {
                req.flash("error", "Campground not found")
                res.redirect("back");
            } else {
                if (foundGarment.author.id.equals(req.user._id)) {
                    next();
                } else {
                    req.flash("error", "You don't have permission to do that :(")
                    res.redirect("back");
                }
            }
        })
    } else {
        req.flash("error", "You need to be logged in to do that!")
        res.redirect("back");
    }
}

middlewareObj.checkCommentOwnership = function (req, res, next) {
    // is user logged in
    if (req.isAuthenticated()) {
        // does user own garment
        Comment.findById(req.params.comment_id, function (err, foundComment) {
            if (err) {
                res.redirect("back");
            } else {
                if (foundComment.author.id.equals(req.user._id)) {
                    next();
                } else {
                    req.flash("You don't have permission to do that :(")
                    res.redirect("back");
                }
            }
        })
    } else {
        req.flash("error", "You need to be logged in to do that!");
        res.redirect("back");
    }

}

middlewareObj.isLoggedIn = function (req, res, next) {
    if (req.isAuthenticated()) {
        return next();
    }
    req.flash("error", "You need to be logged in to do that!");
    res.redirect("/login");
}
module.exports = middlewareObj;