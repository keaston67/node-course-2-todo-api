// Require mongoose - not the mongoose.js file
var mongoose = require('mongoose');

//  create a User model
var User = mongoose.model('User', {
    email: {
        type: String,
        required: true,
        minlength: 1,
        trim: true
    }
});

// need to export the model as an object so is available
module.exports = {User};



// previous code to add users

// //  create a new User instance
// var newUser = new User({
//     email: ' keaston@example.com     '
// });

// // save user to database 
// newUser.save().then((doc) => {
//     //  callbacks
//     //console.log('Added user email ', doc);
//      console.log(JSON.stringify(doc, undefined, 2));
//     },
//     // error handling 
//     (e) => {
//      console.log('Unable to save User email',e)
//     });
