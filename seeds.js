var mongoose = require('mongoose');
var Campground = require('./models/campground');
var Comment   = require('./models/comment');
var data = [
    {
        name: 'Last camp',
        image:'https://www.photosforclass.com/download/pb_3893587',
        description: 'lalala'
    },
    {
        name: 'Last camp 2',
        image:'https://www.photosforclass.com/download/pb_3893587',
        description: 'lalala'
    },
    {
        name: 'Last camp 3',
        image:'https://www.photosforclass.com/download/pb_3893587',
        description: 'lalala'
    }
]

function seedDB(){
    // remove all
    Campground.remove( {}, (err)=> {
        if(err) {
            console.log(err);
        }
        console.log('remove data');
            // add campgrounds
    data.forEach((seed)=> {
        Campground.create(seed, (err, campground)=> {
            if(err){
                console.log(err);
            }else {
                console.log('added data');
                Comment.create({
                    text:'quiet place',
                    author:'author'
                },(err,comment)=> {
                    if(err){
                        console.log(err);
                    }else{
                        campground.comments.push(comment);
                        campground.save();
                        console.log('created comments')
                    }
                });
            }
        });
    });
    });

  


};
module.exports = seedDB;