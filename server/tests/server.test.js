//   Require supertest and expect - mocha and nodemon not called this way
 const expect = require('expect');
 const request = require('supertest');

//  Reference local files to test
const {app} = require('./../server');
const {Todo} = require('./../models/todo');

// add function to clear Todo database before each test
beforeEach((done) => {
    Todo.remove({}).then(() => done());
});

//  describe block with test cases
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
            Todo.find().then((todos) => {
            expect(todos.length).toBe(1);
            expect(todos[0].text).toBe(text);
            done();
            // catch block for any errors occuring inside callback 
        }).catch((e) => done(e));
        });
     });
//   test case to check todo not created with bad data
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
        expect(todos.length).toBe(0);
        done();
        // catch block for any errors occuring inside callback 
    }).catch((e) => done(e));
        });
    });
    
 });




