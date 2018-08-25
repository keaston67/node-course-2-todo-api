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
    
    // db.collection('Users').deleteMany({name: 'Fonzie'}).then((result) => {
    //     console.log(result);
    // });

    //  deleteOne
    // db.collection('Todos').deleteOne({text: 'eat lunch'}).then((result) => {
    //     console.log(result);
    // });

    // findOneAndDelete
    db.collection('Users').findOneAndDelete({
         _id: new ObjectID('5b7f59a7e837e68ba2909cef')
         }).then((result) => {
        console.log(JSON.stringify(result, undefined,2));
    });

    // db.close();
});