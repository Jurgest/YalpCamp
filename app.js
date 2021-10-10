const campground = require('./models/campground');
var express     = require('express'),
    app         = express(),
    bodyParsor  = require('body-parser'),
    mongoose    = require('mongoose'),
    Campgrounds = require('./models/campground'),
    Comment     = require('./models/comment'),
    seedDB      = require('./seeds'),
    User        = require('./models/user'),
    passport    = require('passport'),
    LocalStrategy=require('passport-local');

// passport config
app.use(require('express-session')({
    secret:'Im a new developer here in milano!',
    resave: false,
    saveUninitialized: false
}));
app.use(passport.initialize());
app.use(passport.session());
passport.use(new LocalStrategy(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

app.use((req, res, next)=>{
    res.locals.currentUser = req.user;
    next();
});

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
            res.render('campgrounds/index', {campgrounds:allCampgrounds, currentUser: req.user});
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
app.get('/campgrounds/:id/comments/new', isLoggedIn, (req, res)=> {
    Campgrounds.findById(req.params.id, (err, campground)=> {
        if(err) {
            console.log(err)
        } else {
                 res.render('comments/new', {campground: campground});
        }
    });
});
app.post('/campgrounds/:id/comments', isLoggedIn, (req, res)=> {
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


// auth route
// ==========
// show register form
app.get('/register', (req, res)=>{
    res.render('register');
});
// handle signup logic
app.post('/register',(req, res)=> {
    var newUser = new User({username: req.body.username});
    User.register(newUser, req.body.password, (err, user)=> {
        if(err) {
            console.log(err);
            return res.render('register');
        }
        passport.authenticate('local')(req, res, ()=>{
            res.redirect('/campgrounds');
        });
    });
});

// show login form
app.get('/login', (req, res)=>{
    res.render('login');
});
// handle login
app.post('/login', passport.authenticate('local', {successRedirect: '/campgrounds', failureRedirect: '/login'}), (req, res)=>{
    
});

// logout route
app.get('/logout', (req, res)=> {
    req.logout();
    res.redirect('/campgrounds');
});
function isLoggedIn(req, res, next) {
    if(req.isAuthenticated()){
        return next();
    }
    res.redirect('/login');
 };

app.listen(3000, () => {
    console.log('The yalpCamp started');
});