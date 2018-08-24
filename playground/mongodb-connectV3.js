// MongoDB module v3

const MongoClient = require('mongodb').MongoClient;

MongoClient.connect('mongodb://localhost:27017/TodoApp', (err, client) => {
    if(err) {
        // use return to stop function running or use else block
        return console.log('unable to connect to MongoDB server');
    }
    console.log('Connected to MongoDB server');
    const db = client.db('TodoApp');
    
    db.collection('Todos').insertOne({
        text: 'Something to do',
        completed: false
    }, (err, result) => {
        if(err) {
            // use return to stop function running or use else block
            return console.log('unable to insert todo', err);
        }
        // pretty print to console
        console.log(JSON.stringify(result.ops, undefined, 2))

    });

    // close connection to mongoDB server
    client.close();
});