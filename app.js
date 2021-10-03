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
    image: String,
    description: String
});

var Campgrounds = mongoose.model('Campground', campgroundSchema);
// Campgrounds.create(
//     {
//         name: 'Camp 9',
//         image:'https://www.photosforclass.com/download/pb_4817872',
//         description:'a popular camp'
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
// INDEX ROUTE
app.get('/campgrounds', (req, res)=> {
    // res.render('campgrounds', {campgrounds: campgrounds});
    Campgrounds.find({}, (err, allCampgrounds)=> {
        if(err) {
            console.log(err)
        } else{
            res.render('index', {campgrounds:allCampgrounds});
        }
    });
});
// SHOW FORM for new cg
app.get('/campgrounds/new', (req, res)=> {
    res.render('new.ejs');
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
    Campgrounds.findById(req.params.id, (err,foundCampground) => {
        if(err) {
            console.log(err)
        } else {
                // render show template
                 res.render('show', {campground: foundCampground});
        }
    })
     

});

app.listen(3000, () => {
    console.log('The yalpCamp started');
});