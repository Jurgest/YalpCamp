var express = require('express');
var router  = express.Router({mergeParams: true});
var Campgrounds = require('../models/campground');
var Comment = require('../models/comment');
// new
router.get('/new', isLoggedIn, (req, res)=> {
    Campgrounds.findById(req.params.id, (err, campground)=> {
        if(err) {
            console.log(err)
        } else {
                 res.render('comments/new', {campground: campground});
        }
    });
});
// create
router.post('/', isLoggedIn, (req, res)=> {
    // lookup id
    Campgrounds.findById(req.params.id, (err, campground)=> {
        if(err) {
            console.log(err);
            res.redirect('/campgrounds');
        } else {
                // create new comment
                // connect comment to campg
                // redirect to that campg
                 Comment.create(req.body.comment, (err, comment)=> {
                    if(err) {
                        console.log(err);
                    } else{
                        // add username and id to comments
                            comment.author.id = req.user._id;
                            comment.author.username = req.user.username;
                            comment.save();
                            campground.comments.push(comment);
                            campground.save();
                            res.redirect('/campgrounds/'+ campground._id);
                    } 
                  });
                }
            });
} );
// middle ware
function isLoggedIn(req, res, next) {
    if(req.isAuthenticated()){
        return next();
    }
    res.redirect('/login');
 };
 
module.exports = router;
