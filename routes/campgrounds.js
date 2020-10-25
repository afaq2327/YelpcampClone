var express = require('express');
var router = express.Router();
var camp = require("../models/campgrounds.js");
router.get("/", function(req, res) {
    res.render("landing");
});

//index-show all campgrounds...
router.get("/campgrounds", function(req, res) {
    camp.find({}, function(err, camps) {
        if (err) {
            req.flash("error", "No Campgrounds Available!");
        } else {
            res.render("campgrounds/index", { campgrounds: camps });
        }
    });
});

//create-add a new campground...
router.post("/campgrounds", isLoggedIn, function(req, res) {
    var name = req.body.name;
    var image = req.body.image;
    var desc = req.body.description;
    var author = {
        id: req.user._id,
        username: req.user.username
    };

    camp.create({
        name: name,
        image: image,
        description: desc,
        author: author
    }, function(err, camp) {
        if (err) {
            console.log(err);
        } else {
            req.flash("success", "Campground Added!");
            res.redirect("/campgrounds");
        }
    });

});

//new-show form to create a new campground...
router.get("/campgrounds/new", isLoggedIn, function(req, res) {
    res.render("campgrounds/new");
});

//show-shows more info about a campground...
router.get("/campgrounds/:id", function(req, res) {
    var id = req.params.id;

    camp.findById(id).populate("comments").exec(function(err, foundCampground) {
        if (err) {
            req.flash("error", "No Such Campground Found!");
            res.redirect("/campgrounds");
        } else {
            res.render("campgrounds/show", { camp: foundCampground });
        }
    });
});


router.get("/campgrounds/:id/edit", isLoggedIn, function(req, res) {
    camp.findById(req.params.id, function(err, foundCamp) {
        if (err) {
            console.log(err);
        } else {
            if (foundCamp.author.id.equals(req.user._id)) {
                res.render("campgrounds/edit", { camp: foundCamp });
            } else {
                res.redirect("back");
            }
        }
    });
});

router.put("/campgrounds/:id", isLoggedIn, function(req, res) {
    camp.findByIdAndUpdate(req.params.id, req.body.camp, function(err, updatedCamp) {
        if (err) {
            res.redirect("/campgrounds");
        } else {
            req.flash("success", "Successfully Updated The Campground.")
            res.redirect("/campgrounds/" + req.params.id);
        };
    });
});

router.delete("/campgrounds/:id", isLoggedIn, function(req, res) {
    camp.findById(req.params.id, function(err, foundCamp) {
        if (foundCamp.author.id.equals(req.user._id)) {
            camp.findByIdAndRemove(req.params.id, function(err) {
                if (err) {
                    res.redirect("back");
                } else {
                    req.flash("success", "Campground Deleted!");
                    res.redirect("/campgrounds");
                }
            });
        } else {
            res.redirect("back");
        }
    });
});

function isLoggedIn(req, res, next) {
    if (req.isAuthenticated()) {
        return next();
    }
    req.flash("error", "Please Login First!");
    res.redirect("/login");
};

module.exports = router;