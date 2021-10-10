var express = require('express');
var router  = express.Router({mergeParams: true});
var Campgrounds = require('../models/campground');
var Comment = require('../models/comment');
var middleware = require('../middleware');
// new
router.get('/new', middleware.isLoggedIn, (req, res)=> {
    Campgrounds.findById(req.params.id, (err, campground)=> {
        if(err) {
            console.log(err)
        } else {
                 res.render('comments/new', {campground: campground});
        }
    });
});
// create
router.post('/', middleware.isLoggedIn, (req, res)=> {
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
                            // req.flash('success', 'successfull added!!');
                            res.redirect('/campgrounds/'+ campground._id);
                    } 
                  });
                }
            });
} );
// comments edit
router.get('/:comment_id/edit',middleware.checkCmmOwnership, (req, res)=>{
    Comment.findById(req.params.comment_id, (err,foundComment)=>{
        if(err){
            res.redirect('back');
        }else{
            res.render('comments/edit', {campground_id: req.params.id, comment: foundComment});
        }
    });
});
// update comment
router.put('/:comment_id',middleware.checkCmmOwnership, (req, res)=>{
    Comment.findByIdAndUpdate(req.params.comment_id, req.body.comment , (err, updatedComment)=>{
        if(err) {
            res.redirect('back');
        }else{
            res.redirect('/campgrounds/' + req.params.id);
        }
    });
});
// comment destroy
router.delete('/:comment_id',middleware.checkCmmOwnership,(req, res)=>{
    // findById and remove
    Comment.findByIdAndRemove(req.params.comment_id, (err)=>{
        if(err){
            res.redirect('back');
        }else{
            // req.flash('success', 'comment delete!!');

            res.redirect('/campgrounds/' + req.params.id);
        }
    });
});


module.exports = router;
