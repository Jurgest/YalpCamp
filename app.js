const campground = require('./models/campground');
var express     = require('express'),
    app         = express(),
    bodyParsor  = require('body-parser'),
    mongoose    = require('mongoose'),
    Campgrounds = require('./models/campground'),
    Comment     = require('./models/comment'),
    seedDB      = require('./seeds'),
    // flash       = require('connect-flash'),
    User        = require('./models/user'),
    passport    = require('passport'),
    LocalStrategy=require('passport-local'),
    methodOverride = require('method-override');

    app.use((req, res, next)=>{
        res.locals.currentUser = req.user;
        // res.locals.error = req.flash('error');
        // res.locals.success = req.flash('success');
        next();
    });

// require routes
var commentRoutes    = require('./routes/comments'),
    campgroundRoutes = require('./routes/campgrounds'),
    authRoutes       = require('./routes/index');
// passport config
app.use(require('express-session')({
    secret:'Im a new developer here in milano!',
    resave: false,
    saveUninitialized: false
}));
app.use(methodOverride('_method'));
app.use(passport.initialize());
app.use(passport.session());
passport.use(new LocalStrategy(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());



mongoose.connect('mongodb+srv://jurgest:saadmin@cluster0.t66cq.mongodb.net/YalpCamp?retryWrites=true&w=majority');
app.use(bodyParsor.urlencoded({extended: true}));
app.set('view engine', 'ejs');
app.use(express.static(__dirname + '/public'));
// seedDB();

app.use(authRoutes);
app.use('/campgrounds/:id/comments',commentRoutes);
app.use('/campgrounds',campgroundRoutes);
// app.use(flash());
app.listen(3000, () => {
    console.log('The yalpCamp started');
});