var Campgrounds = require('../models/campground');
var Comment = require('../models/comment');

// all the middleware
var middlewareObj = {};

middlewareObj.isLoggedIn =(req, res, next)=> {
        if(req.isAuthenticated()){
            return next();
        }
        // req.flash('error', 'You need to be logged in!!');
        res.redirect('/login');
     };

middlewareObj.checkCgOwnership = (req, res, next)=>{

        if(req.isAuthenticated()){
            Campgrounds.findById(req.params.id, (err, foundCampground)=>{
                if(err){
                    // req.flash('error', 'Campground not found!!');
                    res.redirect('back');
                }else{
                    if(foundCampground.author.id.equals(req.user._id)){
                       next();
                    }else{
                        // req.flash('error', 'You dont have premissions to do it!!');
                        res.redirect('back');
                    }   
                }
             })
        }else{
            res.redirect('back');
        }
    };
middlewareObj.checkCmmOwnership =(req, res, next)=> {
        if(req.isAuthenticated()){
            Comment.findById(req.params.comment_id, (err, foundComment)=>{
                if(err){
                    // req.flash('error', 'Something went wrong!!');
                    res.redirect('back');
                }else{
                    if(foundComment.author.id.equals(req.user._id)){
                       next();
                    }else{
                    //  req.flash('error', 'Something went wrong!!');
                        res.redirect('back');
                    }   
                }
             })
        }else{
            res.redirect('back');
        }
    };


module.exports = middlewareObj;