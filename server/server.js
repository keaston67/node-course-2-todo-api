var express = require('express');
var bodyParser = require('body-parser');

// require ObjectID to access utility methods
const {ObjectID} = require('mongodb');
// Require the mongoose file/variable using ES6 destructuring
var {mongoose} = require('./db/mongoose');

var {Todo} = require('./models/todo');
var {User} = require('./models/user'); 

var app = express();
const port = process.env.PORT || 3000;

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

app.get('/todos', (req, res) => {
    Todo.find().then((todos) => {
        // send back an object instead of an array
    res.send({todos});
    }, (e) => {
        res.status(400).send(e);
    });
});

//  GET /todos/123456
app.get('/todos/:id', (req, res) => {
//  res.send(req.params);
 var id = req.params.id;
//  Validate id using {ObjectID} utility method
if (!ObjectID.isValid(id)) {
   return res.status(404).send();
 };
//  find by ID
Todo.findById(id).then((todo) => { 
    // no todo
    if(!todo) {
        return res.status(404).send();
        }
    // Success
        res.send({todo})
    // catch error
    }).catch((e) => {
    res.status(400).send();
        });
});

app.delete('/todos/:id', (req, res) => {
    var id = req.params.id;
    //  Validate id using {ObjectID} utility method
if (!ObjectID.isValid(id)) {
    return res.status(404).send();
  };
//   remove todo by Id
Todo.findByIdAndRemove(id).then((todo) => {
    //   if no doc, send 404
if(!todo) {
    return res.status(404).send();
    }
    // Success, return doc and 200
    res.send({todo});
// error send 400 and empty body
}).catch((e) => {
    res.status(400).send();
    });
});



app.listen(port, () => {
    console.log(`started up at port ${port}`);
});
  
module.exports = {app};