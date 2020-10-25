var express = require('express');
var router = express.Router();
var passport = require('passport');
var user = require("../models/user.js");

router.get("/secret", isLoggedIn, function(req, res) {
    res.render("secret");
});

router.get("/register", function(req, res) {
    res.render("register");
});

router.post("/register", function(req, res) {
    user.register(new user({ username: req.body.username }), req.body.password, function(err, user) {
        if (err) {
            req.flash('error', 'A user with the given username is already registered.');
            return res.render("register");
        } else {
            passport.authenticate("local")(req, res, function() {
                req.flash("success", "Welcome To YelpCamp " + req.user.username + " .");
                res.redirect("/campgrounds");
            });
        }
    });
});
router.get("/login", function(req, res) {
    res.render("login");
});
router.post("/login", passport.authenticate("local", {
    successRedirect: "/campgrounds",
    failureRedirect: "/login"
}), function(req, res) {
    req.flash("error", "Username or Password is incorrect!");
    res.send("login");
});
router.get("/logout", function(req, res) {
    req.logout();
    req.flash("success", "Logged You Out!");
    res.redirect("/campgrounds");
});

function isLoggedIn(req, res, next) {
    if (req.isAuthenticated()) {
        return next();
    }
    req.flash("error", "Please Login First!");
    res.redirect("/login");
};

module.exports = router;