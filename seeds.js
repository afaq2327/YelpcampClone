var mongoose = require('mongoose');
var camp = require('./models/campgrounds.js');
var comment = require('./models/comments.js');

var camps = [{
        name: "photo-1",
        image: "https://images.unsplash.com/photo-1558980395-be8a5fcb4251?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=crop&w=1951&q=80",
        description: "man sitting on black and gray touring motorcycle"
    },
    {
        name: "photo-2",
        image: "https://images.unsplash.com/photo-1558981852-426c6c22a060?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=crop&w=500&q=60",
        description: "man sitting on ground beside parked silver cruiser motorcycle"
    },
    {
        name: "photo-3",
        image: "https://images.unsplash.com/photo-1558980664-3a031cf67ea8?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=crop&w=500&q=60",
        description: "man riding touring motorcycle during daytime"
    }
];



function seedDb() {
    camps.forEach(function(seed) {
        camp.create(seed, function(err, camp) {
            if (err) {
                console.log("err");
            } else {
                comment.create({
                    text: "wow! it is awesome!!!",
                    author: "none"
                }, function(err, comment) {
                    if (err) {
                        console.log(err);
                    } else {
                        camp.comments.push(comment);
                        camp.save();
                    }
                });
            }
        });
    });
};



module.exports = seedDb;