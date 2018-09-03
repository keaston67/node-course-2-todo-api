//   Require supertest and expect - mocha and nodemon not called this way
 const expect = require('expect');
 const request = require('supertest');

// require ObjectID to access utility methods and object id from database for tests
const {ObjectID} = require('mongodb');

//  Reference local files to test
const {app} = require('./../server');
const {Todo} = require('./../models/todo');
const {User} = require('./../models/user');
const {todos, populateTodos, users, populateUsers} = require('./seed/seed');

// add function to clear Todo database before each test
beforeEach(populateUsers);
beforeEach(populateTodos);

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

 //  describe block with test cases for patch 
describe('PATCH /todos/:id', () => {
    it('should update the todo', (done) => {
        var hexId = todos[0]._id.toHexString();
        var text = 'Test todo update text';
        var completed = true;
        request(app)
        // use template string to inject object id
        .patch(`/todos/${hexId}`)
        .send({text, completed})
        .expect(200)
        // custom expect call/assertion block
        .expect((res) => {
            expect(res.body.todo.text).toBe(text);
            expect(res.body.todo.completed).toBe(true);
            expect(res.body.todo.completedAt).toBeA('number');
        })
        .end(done);
    });
    it('should clear completed at when todo is not completed', (done) => {
        var hexId = todos[1]._id.toHexString();
        var text = 'Test todo update text!!';
        var completed = false;
        request(app)
        // use template string to inject object id
        .patch(`/todos/${hexId}`)
        .send({text, completed})
        .expect(200)
        // custom expect call/assertion block
        .expect((res) => {
            expect(res.body.todo.text).toBe(text);
            expect(res.body.todo.completed).toBe(false);
            expect(res.body.todo.completedAt).toBe(null);
        })
        .end(done);
    });
});

//  describe block with test cases for GET users/me private route
describe('GET /users/me', () => {
it('should return user if authenticated', (done) => {
    request(app)
    // get request
    .get('/users/me')
    // set a header
    .set('x-auth',users[0].tokens[0].token)
    .expect(200)
    // custom expect call/assertion block
    .expect((res) => {
    expect(res.body._id).toBe(users[0]._id.toHexString())
    expect(res.body.email).toBe(users[0].email)
        }).end(done);
});
it('should return 401 if not authenticated', (done) => {
    request(app)
    // get request
    .get('/users/me')
    // don't set a header
    .expect(401)
    // custom expect call/assertion block
    .expect((res) => {
    expect(res.body).toEqual({});
    }).end(done);
    });
});

//  describe block with test cases for POST users/ private route
describe('POST /users', () => {
    it('should create a user', (done) => {
        var email = 'alfieeaston@example.com';
        var password = 'woofwoof';
        request(app)
        .post('/users')
        .send({email, password})
        .expect(200)
        // custom expect call/assertion block
        .expect((res) => {
        expect(res.headers['x-auth']).toExist();
        expect(res.body._id).toExist();
        expect(res.body.email).toBe(email);
        }).end((err) => {
            // if error return error
           if (err) {
               return done(err);
           } 
           // find user in the database and check test password has been hashed
           User.findOne({email}).then((user) => {
               expect(user).toExist();
               expect(user.password).toNotBe(password);
               done();
           }).catch((e) => done(e));
        });
    });

    it('should return validation errors if request invalid', (done) => {
        var email = 'cocoeaston@example.com';
        var password = 'woohoo';
        request(app)
        .post('/users')
        .send({email, password})
        .expect(400)
        .end(done);
    });
    it('should not create a user if email in use', (done) => {
        var email = 'coconuteaston@example.com';
        var password = 'woohoo';
        request(app)
        .post('/users')
        // .send({email, password})
        // Andrews logic
        .send({email: users[0].email, password})
        .expect(400)
        .end(done);
    });
});

//  describe block with test cases for POST users/login private route
describe('POST /users/login', () => {
    it('should login user and return auth token', (done) => {
    request(app)
    .post('/users/login')
    .send({
        email: users[0].email, 
        password: users[0].password
    })
    .expect(200)
     // custom expect call/assertion block
    .expect((res) => {
        expect(res.headers['x-auth']).toExist();
    })
    // custom asynch function
     .end((err, res) => {
         if(err){
             return done(err);
         }
    // find user in the database and check 
         User.findById(users[0]._id).then((user) => {
            expect(user.tokens[1]).toInclude({
                access: 'auth',
                token: res.headers['x-auth']
            });
            done();
         }).catch((e) => done(e));
     });   
    });

     it('should reject invalid login', (done) => {
        request(app)
        .post('/users/login')
        .send({
            email: users[1].email+"ll", 
            password: users[1].password
        })
        .expect(400)
         // custom expect call/assertion block
        .expect((res) => {
            expect(res.headers['x-auth']).toNotExist();
        })
        // custom asynch function
         .end((err, res) => {
             if(err){
                 return done(err);
             }
        // find user in the database and check 
             User.findById(users[1]._id).then((user) => {
                expect(user.tokens.length).toBe(0);
                done();
             }).catch((e) => done(e));
         });   
     });
});
