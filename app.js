var express     = require('express'),
    app         = express(),
    bodyParsor  = require('body-parser'),
    mongoose    = require('mongoose');

mongoose.connect('mongodb+srv://jurgest:saadmin@cluster0.t66cq.mongodb.net/YalpCamp?retryWrites=true&w=majority');

app.use(bodyParsor.urlencoded({extended: true}))
app.set('view engine', 'ejs');

// SCHEMA setup
var campgroundSchema = new mongoose.Schema({
    name: String,
    image: String
});

var Campgrounds = mongoose.model('Campground', campgroundSchema);
// Campgrounds.create(
//     {
//         name: 'Camp 2',
//         image:'https://pixabay.com/get/g6d464dba6484798fc09a63efc50b752d2d7cbf1aed02a9a9b42a073331f7dd572b75dcc56e767e0a7ee8e8218249f752_340.jpg' 
//     }, (err, campground)=> {
//         if(err) {
//             console.log(err);
//         }else {
//             console.log('new camp created');
//             console.log(campground);
//         }
//     });



app.get('/', (req, res) => {
    res.render('landing');
});

app.get('/campgrounds', (req, res)=> {
    // res.render('campgrounds', {campgrounds: campgrounds});
    Campgrounds.find({}, (err, allCampgrounds)=> {
        if(err) {
            console.log(err)
        } else{
            res.render('campgrounds', {campgrounds:allCampgrounds});
        }
    });
});

app.get('/campgrounds/new', (req, res)=> {
    res.render('new.ejs');
});

app.post('/campgrounds', (req, res)=> {
    // get data from form and add to campground array
    var name = req.body.name ;
    var image = req.body.image;
    var newCampground = {name: name, image: image};
    Campgrounds.create(newCampground,(err, newlyCreated) =>{
        if(err) {
            console.log(err)
        }else{// redirect back to campgrounds
            res.redirect('/campgrounds');
        }
    });
    
    
});

app.listen(3000, () => {
    console.log('The yalpCamp started');
});