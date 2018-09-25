var mongoose = require("mongoose");
var Garment = require("./models/garments");
var Comment  = require("./models/comment");
 
var data = [
    {
        name: "Helmut Lang", 
        image: "https://process.fs.grailed.com/AJdAgnqCST4iPtnUxiGtTz/cache=expiry:max/rotate=deg:exif/resize=height:1760,fit:scale/output=format:jpg,quality:70/compress/G9tKgE1xRua4zZ1imTkW",
        description: "Lorem ipsum dolor sit amet, consectetur adipisicing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum"
    },
    {
        name: "Raf Simons", 
        image: "https://process.fs.grailed.com/AJdAgnqCST4iPtnUxiGtTz/cache=expiry:max/rotate=deg:exif/resize=height:1760,fit:scale/output=format:jpg,quality:70/compress/xrW843aiTCiFqgFMcHBP",
        description: "Lorem ipsum dolor sit amet, consectetur adipisicing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum"
    },
    {
        name: "Rick Owens", 
        image: "https://process.fs.grailed.com/AJdAgnqCST4iPtnUxiGtTz/cache=expiry:max/rotate=deg:exif/resize=height:1760,fit:scale/output=format:jpg,quality:70/compress/wDDjzkXuQQmcZqNzlSnT",
        description: "Lorem ipsum dolor sit amet, consectetur adipisicing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum"
    }
]
 
function seedDB(){
   //Remove all garments
   Garment.remove({}, function(err){
        if(err){
            console.log(err);
        }
        console.log("removed garments!");
        Comment.remove({}, function(err){
            if(err){
                console.log(err);
            }
            console.log("removed comments!");
             //add a few garments
            data.forEach(function(seed){
                Garment.create(seed, function(err, garment){
                    if(err){
                        console.log(err)
                    } else {
                        console.log("Added a garment");
                        //create a comment
                        Comment.create(
                            {
                                text: "This place is great, but I wish there was internet",
                                author: "Homer"
                            }, function(err, comment){
                                if(err){
                                    console.log(err);
                                } else {
                                    garment.comments.push(comment);
                                    garment.save();
                                    console.log("Created new comment");
                                }
                            });
                    }
                });
            });
        });
    }); 
    //add a few comments
}
 
module.exports = seedDB;