// MongoDB module v2

// Destructure MongoClient
//  const MongoClient = require('mongodb').MongoClient;
    const {MongoClient, ObjectID} = require('mongodb');
    // var obj = new ObjectID();
    // console.log(obj);

// // ES6 object destructuring:
// var user = {name: 'Bob', age: 38};
// var {name} = user;
// console.log(name);

MongoClient.connect('mongodb://localhost:27017/TodoApp', (err, db) => {
    if(err) {
        // use return to stop function running or use else block
        return console.log('unable to connect to MongoDB server');
    }
    console.log('Connected to MongoDB server');
       
    // db.collection('Todos').insertOne({
    //         text: 'Something to do',
    //         completed: false
    // }, (err, result) => {
    //     if(err) {
    //         // use return to stop function running or use else block
    //         return console.log('unable to insert todo', err);
    //     }
    //     // pretty print to console
    //     console.log(JSON.stringify(result.ops, undefined, 2))
    // });

    //  Challenge:
//     db.collection('Users').insertOne({
//         //  1st argument
//         // _id: 69,
//         name: 'Fonzie',
//         age: 21,
//         location: "Al's Diner"
//         //  2nd argument = callback
// }, (err, result) => {
//     if(err) {
//     // Error - use return to stop function running or use else block
//         return console.log('unable to insert User', err);
//     }
//     // Success - pretty print to console
//     // console.log(JSON.stringify(result.ops, undefined, 2))
//     console.log(result.ops[0]._id.getTimestamp());
// });
    // close connection to mongoDB server
    db.close();
});