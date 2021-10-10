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
// comments edit
router.get('/:comment_id/edit',checkCmmOwnership, (req, res)=>{
    Comment.findById(req.params.comment_id, (err,foundComment)=>{
        if(err){
            res.redirect('back');
        }else{
            res.render('comments/edit', {campground_id: req.params.id, comment: foundComment});
        }
    });
});
// update comment
router.put('/:comment_id',checkCmmOwnership, (req, res)=>{
    Comment.findByIdAndUpdate(req.params.comment_id, req.body.comment , (err, updatedComment)=>{
        if(err) {
            res.redirect('back');
        }else{
            res.redirect('/campgrounds/' + req.params.id);
        }
    });
});
// comment destroy
router.delete('/:comment_id',checkCmmOwnership,(req, res)=>{
    // findById and remove
    Comment.findByIdAndRemove(req.params.comment_id, (err)=>{
        if(err){
            res.redirect('back');
        }else{
            res.redirect('/campgrounds/' + req.params.id);
        }
    });
});

function checkCmmOwnership(req, res, next) {
    if(req.isAuthenticated()){
        Comment.findById(req.params.comment_id, (err, foundComment)=>{
            if(err){
                res.redirect('back');
            }else{
                if(foundComment.author.id.equals(req.user._id)){
                   next();
                }else{
                    res.redirect('back');
                }   
            }
         })
    }else{
        res.redirect('back');
    }
}


// middle ware
function isLoggedIn(req, res, next) {
    if(req.isAuthenticated()){
        return next();
    }
    res.redirect('/login');
 };
 

module.exports = router;
