var express = require('express');
var router = express.Router();
var camp = require("../models/campgrounds.js");
var comment = require("../models/comments.js");

router.get("/campgrounds/:id/comments/new", isLoggedIn, function(req, res) {
    camp.findById(req.params.id, function(err, camp) {
        if (err) {
            console.log(err);
        } else {
            res.render("comments/new", { camp: camp });
        }
    });
});

router.post("/campgrounds/:id/comments", isLoggedIn, function(req, res) {
    camp.findById(req.params.id, function(err, camp) {
        if (err) {
            console.log(err);
            res.redirect("/campgrounds");
        } else {
            comment.create(req.body.comment, function(err, comment) {
                if (err) {
                    console.log(err);
                } else {
                    comment.author.id = req.user._id;
                    comment.author.username = req.user.username;
                    comment.save();
                    camp.comments.push(comment);
                    camp.save();
                    req.flash("success", "Comment Added!");
                    res.redirect("/campgrounds/" + camp._id);
                }
            });
        }
    });
});

router.get("/campgrounds/:id/comments/:comment_id/edit", isLoggedIn, function(req, res) {
    comment.findById(req.params.comment_id, function(err, foundComment) {
        if (err) {
            console.log(err);
        } else {
            if (foundComment.author.id.equals(req.user._id)) {
                camp.findById(req.params.id, function(err, foundCamp) {
                    if (err) {
                        console.log(err);
                    } else {
                        res.render("comments/edit", { comment: foundComment, camp: foundCamp });
                    }
                });
            } else {
                res.redirect("back");
            }
        }
    });
});

router.put("/campgrounds/:id/comments/:comment_id", isLoggedIn, function(req, res) {
    comment.findByIdAndUpdate(req.params.comment_id, req.body.comment, function(err, updatedComment) {
        if (err) {
            res.redirect("/campgrounds");
        } else {
            req.flash("success", "Comment edited!");
            res.redirect("/campgrounds/" + req.params.id);
        };
    });
});

router.delete("/campgrounds/:id/comments/:comment_id", isLoggedIn, function(req, res) {
    comment.findById(req.params.comment_id, function(err, foundComment) {
        if (foundComment.author.id.equals(req.user.id)) {
            comment.findByIdAndRemove(req.params.comment_id, function(err) {
                if (err) {
                    res.redirect("back");
                } else {
                    req.flash("success", "Comment deleted!");
                    res.redirect("/campgrounds/" + req.params.id);
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