var express = require("express");
var router = express.Router();
var Garment = require("../models/garments");
var middleware = require("../middleware")

//INDEX - show all garments
router.get("/", function(req,res){
    // Get all garments from DB
    Garment.find({}, function(err,allGarments){
        if(err){
            console.log(err);
        } else {
            res.render("garments/index", {garments:allGarments});
        }
    });
});

// CREATE- add new garment to database
// This route is used by the form in new.ejs
router.post("/" , middleware.isLoggedIn, function(req,res){
    // get data from form and add to garments array
    // we are using body parser here to get the information from the post request 
    // name, image, description are the 'names' set in the form
    var name = req.body.name;
    var price = req.body.price;
    var image = req.body.image;
    var desc = req.body.description;
    var author = {
        id: req.user._id,
        username: req.user.username
    }
    var newGarment = {name: name, price: price, image: image, description: desc, author: author};
    // Create a new garment and save in database
    Garment.create(newGarment, function(err, newlyCreated){
        if (err){
            console.log(err);
        } else {
            // redirect back to garments page 
            // we have 2 garments routes but the default behaviour is to redirect to get request
            console.log(newlyCreated);
            res.redirect("/garments");
        }
    });

});

//NEW- show form to create new garment 
router.get("/new", middleware.isLoggedIn, function(req,res){
    res.render("garments/new");
})

//SHOW- shows more info about one garment 
//The ":id" is the route parameter, and we can access this via req.params.id
router.get("/:id",function(req,res){
    // find the garment with provided ID
    Garment.findById(req.params.id).populate("comments").exec(function(err, foundGarment){
        if(err){
            console.log(err);
        } else {
            //render show template with that campground
            //pass in the garment we found using the database query
            res.render("garments/show", {garment:foundGarment}); 
        }
    });
});

// EDIT GARMENT ROUTE
router.get("/:id/edit", middleware.checkGarmentOwnership ,function(req, res){
    Garment.findById(req.params.id, function(err, foundGarment){
        res.render("garments/edit", {garment: foundGarment});
    });
});

// UPDATE GARMENT ROUTE- form submits here from edit
router.put("/:id", middleware.checkGarmentOwnership, function(req,res){
    // find and update correct garment
    Garment.findByIdAndUpdate(req.params.id, req.body.garment, function(err,updatedGarment){
        if(err){
            res.redirect("/garments");
        } else {
            // redirect to show page
            res.redirect("/garments/" + req.params.id);
        }
    });
});

// DESTROY GARMENT ROUTE
router.delete("/:id",middleware.checkGarmentOwnership,function(req,res){
    Garment.findByIdAndRemove(req.params.id, function(err){
        if(err){
            res.redirect("/garments");
        } else {
            res.redirect("/garments");
        }
    });
});


module.exports = router;