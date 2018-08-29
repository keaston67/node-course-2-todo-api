// require ObjectID to access utility methods
const {ObjectID} = require('mongodb');

//  Reference local files
const {mongoose} = require('./../server/db/mongoose');
const {Todo} = require('./../server/models/todo');
const {User} = require('./../server/models/user'); 

// remove all docs from database
// Todo.remove({}).then((result) => {
// console.log(result);
// });

// remove one doc by id, returning doc
// Todo.findByIdAndRemove('5b8723c86f3b2818e01c2594').then((todo) => {
// console.log(todo);
// });

Todo.findOneAndRemove({_id:'5b8725106f3b2818e01c2611'}).then((todo) => {
    console.log(todo);
    });