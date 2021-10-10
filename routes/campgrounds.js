var express = require('express');
var router  = express.Router();
var Campgrounds = require('../models/campground');
// INDEX ROUTE
router.get('/', (req, res)=> {
    // res.render('campgrounds', {campgrounds: campgrounds});
    Campgrounds.find({}, (err, allCampgrounds)=> {
        if(err) {
            console.log(err)
        } else{
            res.render('campgrounds/index', {campgrounds:allCampgrounds, currentUser: req.user});
        }
    });
});
// SHOW FORM for new cg
router.get('/new',isLoggedIn, (req, res)=> {
    res.render('campgrounds/new');
});
// CREATE 
router.post('/',isLoggedIn, (req, res)=> {
    // get data from form and add to campground array
    var name = req.body.name ;
    var image = req.body.image;
    var desc = req.body.description;
    var author = {
        id: req.user._id,
        username:req.user.username
    };
    var newCampground = {name: name, image: image, description:desc, author: author};
    Campgrounds.create(newCampground,(err, newlyCreated) =>{
        if(err) {
            console.log(err)
        }else{// redirect back to campgrounds
            res.redirect('/campgrounds');
        }
    });
});
// SHOW DETAILED PAGE
router.get('/:id', (req, res) => {
    // find the ID
    Campgrounds.findById(req.params.id).populate('comments').exec( (err,foundCampground) => {
        if(err) {
            console.log(err)
        } else {
                 res.render('campgrounds/show', {campground: foundCampground});
        }
    });
     
});
// Edit campg
router.get('/:id/edit',checkCgOwnership, (req, res)=> {
        Campgrounds.findById(req.params.id, (err, foundCampground)=>{
                    res.render('campgrounds/edit', {campground: foundCampground});
            });
        });


// update cg
router.put('/:id',checkCgOwnership, (req, res)=>{
    // find and update then redirect
    Campgrounds.findByIdAndUpdate(req.params.id,req.body.campground, (err,updatedCampground)=>{
        if(err){
            res.redirect('/campgrounds');
        }else{
            res.redirect('/campgrounds/' + req.params.id );
        }
    } )
});

// destroy route
router.delete('/:id',checkCgOwnership, (req, res)=>{
    Campgrounds.findByIdAndRemove(req.params.id, (err)=>{
    if(err){
        res.redirect('/campgrounds');
    }else{
        res.redirect('/campgrounds');
    };
    })
});


// middle ware
function isLoggedIn(req, res, next) {
    if(req.isAuthenticated()){
        return next();
    }
    res.redirect('/login');
 };

 function checkCgOwnership(req, res, next) {
    if(req.isAuthenticated()){
        Campgrounds.findById(req.params.id, (err, foundCampground)=>{
            if(err){
                res.redirect('back');
            }else{
                if(foundCampground.author.id.equals(req.user._id)){
                   next();
                }else{
                    res.redirect('back');
                }   
            }
         })
    }else{
        res.redirect('back');
    }
};

module.exports = router;