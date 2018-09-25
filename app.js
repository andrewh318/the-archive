var express       = require("express"),
    app           = express(),
    mongoose      = require("mongoose"),
    flash         = require("connect-flash"),
    passport      = require("passport"),
    LocalStrategy = require("passport-local"),
    methodOverride = require("method-override");
    bodyParser    = require("body-parser"),
    Garment       = require("./models/garments"),
    Comment       = require("./models/comment"),
    User          = require("./models/user"),
    seedDB        = require("./seeds");

// set port for heroku
var port = process.env.PORT || 3000;

// requiring routes
var commentRoutes = require("./routes/comments"),
    garmentRoutes = require("./routes/garments"),
    indexRoutes   = require("./routes/index");

// local database
mongoose.connect(process.env.DATABASEURL, { useNewUrlParser: true});

// remote database
// mongoose.connect("mongodb://andrew:andrewhu123@ds113693.mlab.com:13693/thearchive", { useNewUrlParser: true});


app.use(bodyParser.urlencoded({extended: true}));

app.set("view engine", "ejs");

app.use(express.static(__dirname + "/public"));
app.use(methodOverride("_method"));

app.use(flash());

// PASSPORT CONFIGURATION
app.use(require("express-session")({
    secret: "Once again mango is the best",
    resave: false,
    saveUninitialized: false
}));

app.use(passport.initialize());
app.use(passport.session());

// all these methods we are adding to passport are given to us by passport-local-mongoose
passport.use(new LocalStrategy(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

// this function will run for every single route
// if we don't include next(), nothing will happen afterwards
app.use(function(req,res,next){
   res.locals.currentUser = req.user;
   res.locals.error = req.flash("error");
   res.locals.success = req.flash("success");
   next(); 
});

// tell app to use these three routes we've required
app.use(indexRoutes);
app.use("/garments/:id/comments", commentRoutes);
app.use("/garments", garmentRoutes);


// Tell express to listen for requests (start server)
app.listen(port, function() {
    console.log('Our app is running on http://localhost:' + port);
});