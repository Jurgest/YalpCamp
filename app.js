const campground = require('./models/campground');

var express     = require('express'),
    app         = express(),
    bodyParsor  = require('body-parser'),
    mongoose    = require('mongoose'),
    Campgrounds = require('./models/campground'),
    Comment     = require('./models/comment'),
    seedDB      = require('./seeds');


mongoose.connect('mongodb+srv://jurgest:saadmin@cluster0.t66cq.mongodb.net/YalpCamp?retryWrites=true&w=majority');
app.use(bodyParsor.urlencoded({extended: true}));
app.set('view engine', 'ejs');
app.use(express.static(__dirname + '/public'));
seedDB();

app.get('/', (req, res) => {
    res.render('landing');
});
// INDEX ROUTE
app.get('/campgrounds', (req, res)=> {
    // res.render('campgrounds', {campgrounds: campgrounds});
    Campgrounds.find({}, (err, allCampgrounds)=> {
        if(err) {
            console.log(err)
        } else{
            res.render('campgrounds/index', {campgrounds:allCampgrounds});
        }
    });
});
// SHOW FORM for new cg
app.get('/campgrounds/new', (req, res)=> {
    res.render('campgrounds/new');
});
// CREATE 
app.post('/campgrounds', (req, res)=> {
    // get data from form and add to campground array
    var name = req.body.name ;
    var image = req.body.image;
    var desc = req.body.description;
    var newCampground = {name: name, image: image, description:desc};
    Campgrounds.create(newCampground,(err, newlyCreated) =>{
        if(err) {
            console.log(err)
        }else{// redirect back to campgrounds
            res.redirect('/campgrounds');
        }
    });
});
// SHOW DETAILED PAGE
app.get('/campgrounds/:id', (req, res) => {
    // find the ID
    Campgrounds.findById(req.params.id).populate('comments').exec( (err,foundCampground) => {
        if(err) {
            console.log(err)
        } else {
                 res.render('campgrounds/show', {campground: foundCampground});
        }
    })
     
});
// =====================
// comment routs
// =====================
app.get('/campgrounds/:id/comments/new', (req, res)=> {
    Campgrounds.findById(req.params.id, (err, campground)=> {
        if(err) {
            console.log(err)
        } else {
                 res.render('comments/new', {campground: campground});
        }
    });
});
app.post('/campgrounds/:id/comments', (req, res)=> {
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
                            campground.comments.push(comment);
                            campground.save();
                            res.redirect('/campgrounds/'+ campground._id);
                    } 
                  });
                }
            });


} );

app.listen(3000, () => {
    console.log('The yalpCamp started');
});