// MongoDB module v2

// Destructure MongoClient
//  const MongoClient = require('mongodb').MongoClient;
    const {MongoClient, ObjectID} = require('mongodb');


MongoClient.connect('mongodb://localhost:27017/TodoApp', (err, db) => {
    if(err) {
        // use return to stop function running or use else block
        return console.log('unable to connect to MongoDB server');
    }
    console.log('Connected to MongoDB server');
    
    // find Todos's
    // db.collection('Todos').find({
    //  _id: new ObjectID('5b7f5fe353d96d4a8701f009') 
    // }).toArray().then((docs) => {
    //     console.log('Todos');
    //     console.log(JSON.stringify(docs, undefined,2));
    // }, (err) => {
    //     console.log('Unable to fetch todos', err);
    // });

    //  find Users
    db.collection('Users').find({name: 'Fonzie'
    }).toArray().then((users) => {
        console.log('Users');
        console.log(JSON.stringify(users, undefined,2));
    }, (err) => {
        console.log('Unable to fetch todos', err);
    });

    // count
    // db.collection('Todos').find({}).count().then((count) => {
    //     console.log(`Todo's count: ${count}`);
    // }, (err) => {
    //     console.log('Unable to fetch todos', err);
    // });
    // db.close();
});