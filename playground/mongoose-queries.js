// require ObjectID to access utility methods
const {ObjectID} = require('mongodb');

//  Reference local files
const {mongoose} = require('./../server/db/mongoose');
const {Todo} = require('./../server/models/todo');
const {User} = require('./../server/models/user'); 

// todo queries
// var id = '5b846fef59c1d8d3c2d1cfc211';

// if (!ObjectID.isValid(id)) {
// console.log('ID not valid');
// };

// // Can pass in an id as a string 
// Todo.find({
//     _id: id
// }).then((todos) => {
//     console.log('Todos: ', todos);
// });

// // returns only 1 document - 1st one that matches query
// Todo.findOne({
//     _id: id
// }).then((todo) => {
//     console.log('Todo: ', todo);
// });

// find by id
//  Todo.findById(id).then((todo) => {
//      if(!todo) {
//          return console.log('Id not found');
//      }
//     console.log('Todo findById: ', todo);
// }).catch((e) => console.log(e));

// user queries
 var id = "5b81ede5ceb7c535a2564e3b";
// find by id
 User.findById(id).then((user) => {
   if(!user) {
         return console.log('User not found');
     }
    console.log(JSON.stringify(user, undefined,2));
}).catch((e) => console.log(e));
