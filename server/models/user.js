
// Require mongoose - not the mongoose.js file
const mongoose = require('mongoose');
const validator = require('validator');
const jwt = require('jsonwebtoken');
const _ = require('lodash');
const bcrypt = require('bcryptjs');

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

// model method using statics not methods to create model method
// use standard function as want to bind to this
UserSchema.statics.findByToken = function (token) {
    // model methods get called with the 
var User = this;
var decoded;

try {
    decoded = jwt.verify(token, 'abc123');

} catch (e) {  
    // return new Promise((resolve, reject) => {
    //     reject();
    // });
    // simplified error promise, could pas in value e.g. .reject('test'); that 
    // will return as (e) argument in server.js
    return Promise.reject();
}
//  success case - returns a promise so return it to be able to chain
return User.findOne({
    '_id': decoded._id,
    // to query nested object wrap in quotes, no auth or id var so wrap in quotes
    'tokens.token': token,
    'tokens.access': 'auth'
    });
};

// model method to support user login
UserSchema.statics.findByCredentials = function (email, password) {
    var User = this;
    return User.findOne({email}).then ((user) => {
        if(!user) {
            return Promise.reject();
        }
        return new Promise((resolve, reject) => {
            bcrypt.compare(password, user.password, (err, res) => {
                // res ? resolve(user) : reject();
                if (res) {resolve(user) } else {
                    reject();
                }
                });
            });
        });
    };


// mongoose middleware function for password hashing
UserSchema.pre('save', function (next) {
    var user = this;
    //  method runs on save so need to check user instance
    //  using isModified to make sure we don't re-hash a hashed password
    if(user.isModified('password')) {
          // bcrypt methods here
            bcrypt.genSalt(10, (err, salt) => {
                bcrypt.hash(user.password, salt, (err,hash) => {
                    user.password = hash;
                    next();
                });
            });
    } else {
    next();
    }
});


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
 