// require ObjectID to access utility methods and object id from database for tests
const {ObjectID} = require('mongodb');
const jwt = require('jsonwebtoken');
// reference models directory - up two levels
const {Todo} = require('./../../models/todo');
const {User} = require('./../../models/user');

const userOneId = new ObjectID();
const userTwoId = new ObjectID();

// dummy users for testing
const users = [{
    _id: userOneId,
    email: 'miloeaston@example.com',
    password: 'userOnePass',
    tokens: [{
        access: 'auth', 
        token: jwt.sign({_id:userOneId.toHexString(), access: 'auth'}, 'abc123').toString()
    }]},{
    _id: userTwoId,
    email: 'cocoeaston@example.com',
    password: 'userTwoPass',
}];

// dummy todos for testing
const todos = [{
    _id: new ObjectID,
    text: 'First test todo'},
    {
     _id: new ObjectID,
    text: 'Second test todo',
    completed: true,
    completeAt:  333
}];

const populateTodos = (done) => {
    Todo.remove({}).then(() => {
    return Todo.insertMany(todos); 
    }).then(() => done());    
}

const populateUsers = (done) => {
    User.remove({}).then(() => {
        var userOne = new User(users[0]).save();
        var userTwo = new User(users[1]).save();
    
        return Promise.all([userOne, userTwo])
    }).then(() => done());
};

module.exports = {todos, populateTodos, users, populateUsers};