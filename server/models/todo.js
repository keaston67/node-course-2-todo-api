// Require mongoose - not the mongoose.js file
var mongoose = require('mongoose');

//  create a Todo model
var Todo = mongoose.model('Todo', {
    text: {
        type: String,
        required: true,
        minlength: 1,
        trim: true
    },
    completed: {
        type: Boolean,
        default: false
    },
    completedAt: {
        type: Number,
        default: null
    },
    _creator: {
        type: mongoose.Schema.Types.ObjectId,
        required: true
    }
});

// need to export the model as an object so is available
module.exports = {Todo};

// previous code to add todos
//  create a new Todo instance
// var otherTodo = new Todo({
//      text: '  Edit this video  '
//     // completed: false,
//     // completedAt: 27082018
// });

// save todo to database 
// otherTodo.save().then((doc) => {
// //  callbacks
// console.log(JSON.stringify(doc, undefined, 2));
// },
// // error handling 
// (e) => {
//  console.log('Unable to save todo',e)
// });