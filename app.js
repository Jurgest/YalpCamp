var express = require('express');
var app = express();
var bodyParsor = require('body-parser');

app.use(bodyParsor.urlencoded({extended: true}))
app.set('view engine', 'ejs');
var campgrounds = [
    {name: 'First mountin', image:'https://pixabay.com/get/ge84e8df0a74e2375155fef13bd48877407d192ff9225a48e4b6788c2b10e1affc84abd8f082220b8e32a44240563354a_340.jpg'},
    {name: 'second mountin', image:'https://pixabay.com/get/g6d464dba6484798fc09a63efc50b752d2d7cbf1aed02a9a9b42a073331f7dd572b75dcc56e767e0a7ee8e8218249f752_340.jpg'},
    {name: 'third mountin', image:'https://pixabay.com/get/g7949718ac7fec181a78bf9a2aed9ef8f372e217dd3025e5fab0adfd85fc441ebbaaab9d0945eb187b62261ea4ff2b770_340.jpg'},
    {name: 'First mountin', image:'https://pixabay.com/get/ge84e8df0a74e2375155fef13bd48877407d192ff9225a48e4b6788c2b10e1affc84abd8f082220b8e32a44240563354a_340.jpg'},
    {name: 'second mountin', image:'https://pixabay.com/get/g6d464dba6484798fc09a63efc50b752d2d7cbf1aed02a9a9b42a073331f7dd572b75dcc56e767e0a7ee8e8218249f752_340.jpg'},
    {name: 'third mountin', image:'https://pixabay.com/get/g7949718ac7fec181a78bf9a2aed9ef8f372e217dd3025e5fab0adfd85fc441ebbaaab9d0945eb187b62261ea4ff2b770_340.jpg'},
    {name: 'First mountin', image:'https://pixabay.com/get/ge84e8df0a74e2375155fef13bd48877407d192ff9225a48e4b6788c2b10e1affc84abd8f082220b8e32a44240563354a_340.jpg'},
    {name: 'second mountin', image:'https://pixabay.com/get/g6d464dba6484798fc09a63efc50b752d2d7cbf1aed02a9a9b42a073331f7dd572b75dcc56e767e0a7ee8e8218249f752_340.jpg'},
    {name: 'third mountin', image:'https://pixabay.com/get/g7949718ac7fec181a78bf9a2aed9ef8f372e217dd3025e5fab0adfd85fc441ebbaaab9d0945eb187b62261ea4ff2b770_340.jpg'}

];

app.get('/', (req, res) => {
    res.render('landing');
});

app.get('/campgrounds', (req, res)=> {
    res.render('campgrounds', {campgrounds: campgrounds});
});

app.get('/campgrounds/new', (req, res)=> {
    res.render('new.ejs');
});

app.post('/campgrounds', (req, res)=> {
    // get data from form and add to campground array
    var name = req.body.name ;
    var image = req.body.image;
    var newCampground = {name: name, image: image};
    campgrounds.push(newCampground);
    // redirect back to campgrounds
    res.redirect('/campgrounds');
});

app.listen(3000, () => {
    console.log('The yalpCamp started');
});