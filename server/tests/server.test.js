//   Require supertest and expect - mocha and nodemon not called this way
 const expect = require('expect');
 const request = require('supertest');

// require ObjectID to access utility methods and object id from database for tests
const {ObjectID} = require('mongodb');

//  Reference local files to test
const {app} = require('./../server');
const {Todo} = require('./../models/todo');

// dummy todos for testing
const todos = [{
    _id: new ObjectID,
    text: 'First test todo'},
    {
     _id: new ObjectID,
    text: 'Second test todo'   
}];

// add function to clear Todo database before each test
beforeEach((done) => {
    Todo.remove({}).then(() => {
    return Todo.insertMany(todos); 
    }).then(() => done());    
});


//  describe block with test cases for POST /todos
describe('POST /todos', () => {
    it('should create a new todo', (done) => {
        var text = 'Test todo text';

        request(app)
        .post('/todos')
        .send({text})
        // assertions
        .expect(200)
        // custom expect assertion block about response 
        // body passing in a function
        .expect((res) => {
            expect(res.body.text).toBe(text);
        })
        // want to check what was saved to mongo - why loaded model above
        .end((err, res) => {
            if (err) {
            // pass to done using return to end execution 
                return done(err);
            }
            // make request to database to verify test todo was added
            Todo.find({text}).then((todos) => {
            expect(todos.length).toBe(1);
            expect(todos[0].text).toBe(text);
            done();
            // catch block for any errors occuring inside callback 
        }).catch((e) => done(e));
        });
     });
    //  test case to check todo not created with bad data
    it('should not create a new todo with invalid body data', (done) => {
    // var text = 'Test invalid todo text';
    request(app)
    .post('/todos')
    .send({})
    // assertions
    .expect(400) 
    // want to check what was saved to mongo - why loaded model above
    .end((err, res) => {
        if (err) {
        // pass to done using return to end execution 
            return done(err);
        }
        // make request to database to verify test todo was not added
        Todo.find().then((todos) => {
        expect(todos.length).toBe(2);
        done();
        // catch block for any errors occuring inside callback 
    }).catch((e) => done(e));
        });
    });
    
 });

//  describe block with test cases for GET /todos 
describe('GET /todos', () => {
    it('should get all todos', (done) => {
        request(app)
        .get('/todos')
        // assertions
        .expect(200)
        .expect((res) => {
            expect(res.body.todos.length).toBe(2);
        })
        //  no need to provide a function to end as above as no asynch here
        .end(done)  
    });
});

//  describe block with test cases for GET /todos/:id will need to pull in id property
describe('GET /todos/:id', () => {
    it('should return todo doc', (done) => {
        request(app)
        // use template string to inject object id
        .get(`/todos/${todos[0]._id.toHexString()}`)
        // assertions
        .expect(200)
        // custom expect call/assertion block
        .expect((res) => {
            expect(res.body.todo.text).toBe(todos[0].text);
        })
        .end(done);
    });

    it('should return 404 if todo doc not found', (done) => {
        // create a new id string using new ObjectID
        var hexId = new ObjectID().toHexString();
        // console.log('hexId: ', hexId);
        request(app)
        // use template string to inject object id
        // .get(`/todos/${new ObjectID().toHexString()}`)
        .get(`/todos/${hexId}`)
        // assertions
        .expect(404)
        .end(done);
    });

    it('should return 404 for non-object ids', (done) => {
        // my test variables 
        // var testId = todos[0]._id;
        //var testId = '123abc'
        request(app)
        // use template string to inject object id
        .get('/todos/123abc')
        // assertions
        .expect(404)
        .end(done);
    });
});


//  describe block with test cases for delete 
describe('DELETE /todos/:id', () => {
    it('should remove a todo doc', (done) => {
        var hexId = todos[1]._id.toHexString();

        request(app)
        // make a http request to delete the todo
        .delete(`/todos/${hexId}`)
        // assertions
        .expect(200)
        // custom expect call/assertion block
        .expect((res) => {
            expect(res.body.todo._id).toBe(hexId);
        })
        .end((err, res) => {
            if (err) {
            // pass to done using return to end execution 
                return done(err);
            }
        Todo.findById(hexId).then((todo) => {
            expect(todo).toNotExist();
            //  end test
            done();
            //  catch block
             }).catch((e) => done(e));
        });
    });
    it('should return 404 if todo doc not found', (done) => {
        // create a new id string using new ObjectID
        var hexId = new ObjectID().toHexString();
        // console.log('hexId: ', hexId);
        request(app)
        // use template string to inject object id
        // .get(`/todos/${new ObjectID().toHexString()}`)
        .delete(`/todos/${hexId}`)
        // assertions
        .expect(404)
        .end(done);
    });
    it('should return 404 for non-object ids', (done) => {
        // my test variables 
        // var testId = todos[0]._id;
        var testId = '123abc'
        request(app)
        // use template string to inject object id
        .delete(`/todos/${testId}`)
        // assertions
        .expect(404)
        .end(done);
    });
 });