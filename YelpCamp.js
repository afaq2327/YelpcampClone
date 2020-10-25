var express = require('express'),
    mongoose = require('mongoose'),
    passport = require('passport'),
    bodyParser = require('body-parser'),
    localStrategy = require('passport-local'),
    flash = require('connect-flash'),
    passportLocalMongoose = require('passport-local-mongoose'),
    methodOverride = require('method-override'),
    camp = require('./models/campgrounds.js'),
    comment = require('./models/comments.js'),
    user = require("./models/user.js"),
    seedDb = require('./seeds.js');

var campRoutes = require("./routes/campgrounds.js"),
    commentRoutes = require("./routes/comments.js"),
    userRoutes = require("./routes/users.js");

//Run only first time to add default camps.
//seedDb();

mongoose.connect("mongodb://localhost/YelpCamp", { useNewUrlParser: true });
app = express();

app.use(require('express-session')({
    secret: 'Hard work is the secret to success',
    resave: false,
    saveUninitialized: false
}));

app.set("view engine", "ejs");
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static(__dirname + "/public"));
app.use(passport.initialize());
app.use(passport.session());
app.use(methodOverride("_method"));
app.use(flash());
passport.use(new localStrategy(user.authenticate()));
passport.serializeUser(user.serializeUser());
passport.deserializeUser(user.deserializeUser());

app.use(function(req, res, next) {
    res.locals.currentUser = req.user;
    res.locals.error = req.flash("error");
    res.locals.success = req.flash("success");
    next();
});

app.use(campRoutes);
app.use(commentRoutes);
app.use(userRoutes);

/////////////////////////////////////////////////
app.listen(3000, function() {
    console.log("Listening At Port 3000...");
});