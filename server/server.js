var express = require('express');
var bodyParser = require('body-parser');

// Require the mongoose file/variable using ES6 destructuring
var {mongoose} = require('./db/mongoose');

var {Todo} = require('./models/todo');
var {User} = require('./models/user'); 

var app = express();

// register (body-parser) middleware - can now send JSON to
// our express application
app.use(bodyParser.json());

//  Configure routes 
app.post('/todos', (req, res) => {
// use body parser to take JSON object to send to server 
// log to see request body & where gets stored to by body parser
// console.log(req.body);

// create an instance of a new mongoose model
var todo = new Todo({
    text: req.body.text
});
// save to mongoDB using mongoose save method
todo.save().then((doc)  => {
    res.send(doc);
// error handling with status code   
}, (e) => {
res.status(400).send(e);
    });
});


app.listen(3000, () => {
    console.log('started on port 3000');
});
  
module.exports = {app};