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
    })
     
});
// middle ware
function isLoggedIn(req, res, next) {
    if(req.isAuthenticated()){
        return next();
    }
    res.redirect('/login');
 };


module.exports = router;