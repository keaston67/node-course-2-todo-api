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
    
    // db.collection('Todos').findOneAndUpdate({
    //     _id: new ObjectID('5b8095b3789728fef48c14f5')
    // }, {
    //     $set: {
    //     completed: true    
    //     } }, { returnOriginal: false 
    // }).then((result) => {
    //     console.log(result);
    // });

    db.collection('Users').findOneAndUpdate({
    // _id: new ObjectID('5b7f5343641de08b88327949')
        name: 'Fred'
    }, {
        $set: {
        name: 'Kim'    
        },
        $inc: {
        age: 1
        }
     }, { returnOriginal: false 
    }).then((result) => { 
        console.log(result);
    });
    // db.close();
});