
// Require mongoose - not the mongoose.js file
const mongoose = require('mongoose');
const validator = require('validator');
const jwt = require('jsonwebtoken');
const _ = require('lodash');

var UserSchema = new mongoose.Schema({
    email: {
        type: String,
        required: true,
        minlength: 1,
        trim: true,
        unique: true,
        validate: {
            validator : validator.isEmail,
            // validator : (value) => {
            //     return validator.isEmail(value);
            // {VALUE} needs to be uppercase below:
            message: '{VALUE} is not a valid email'
        }
    },
    password: {
        type: String,
        require: true,
        minlength: 6
    },
    tokens: [{
        access: {
        type: String,
        required: true
        },
        token: {
        type: String,
        required: true
        }
    }]
});
// Set what gets sent back when a mongoose model gets sent back as a json value
UserSchema.methods.toJSON = function() {
    var user = this;
    var userObject = user.toObject();

    return _.pick(userObject, ['_id', 'email']);

};

// Use regular function as arrow function doesn't bind this keyword and we 
// need to bind to individual documents.
UserSchema.methods.generateAuthToken =  function () {
    var user = this;
    var access = 'auth';
    var token = jwt.sign({_id: user._id.toHexString(), access}, 'abc123').toString();
    user.tokens = user.tokens.concat([{access, token}]);
    
    return user.save().then(() => {
        return token;
    });
};

var User = mongoose.model('User', UserSchema);

// need to export the model as an object so is available
module.exports = {User};

// var User = mongoose.model('User', {
//     email: {
//         type: String,
//         required: true,
//         minlength: 1,
//         trim: true,
//         unique: true,
//         validate: {
//             validator : validator.isEmail,
//             // validator : (value) => {
//             //     return validator.isEmail(value);
//             // {VALUE} needs to be uppercase below:
//             message: '{VALUE} is not a valid email'
//         }
//     },
//     password: {
//         type: String,
//         require: true,
//         minlength: 6
//     },
//     tokens: [{
//         access: {
//         type: String,
//         required: true
//         },
//         token: {
//         type: String,
//         required: true
//         }
//     }]
// });





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
 