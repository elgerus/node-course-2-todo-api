const expect = require('expect');
const request = require('supertest');
const {ObjectID} = require('mongodb');

const {app} = require('./../server.js');
const {Todo} = require('./../models/todos.js');
const {User} = require('./../models/user.js');

const todos = [{ _id: new ObjectID(),
                text: 'First test todo'},
              { _id: new ObjectID(),
                text: 'Second test todo'},
              { _id: new ObjectID(),
                text: 'Third test todo'}];

beforeEach((done) => {
  Todo.remove({}).then(()=>{
    return Todo.insertMany(todos);
  }).then(()=> done());
});

describe('POST /todos', ()=>{
  it('Should create a new todo', (done)=>{
    var text ='Test todo text';
    request(app).post('/todos')
    .send({text})
    .expect(200)
    .expect((res)=>{
      expect(res.body.text).toBe(text);
    }).end((err, res)=>{
      if(err){
        return done(err);
      }
      Todo.find().then((todos)=> {
        expect(todos.length).toBe(4);
        expect(todos[3].text).toBe(text);
        done();
      }).catch((e)=> done(e));
    });
  });

  it('Should not create a todo with invalid data', (done)=>{
    var text = '';
    request(app).post('/todos')
    .send({text})
    .expect(400)
    .end((err, res)=>{
      if(err){
        return done(err);
      }
      Todo.find().then((todos)=> {
        expect(todos.length).toBe(3);
        done();
      }).catch((e)=> done(e));
    });
  });
});

describe('GET /todos',()=>{
  it('Should return the whole todos', (done)=>{
    request(app).get('/todos')
      .expect(200)
      .expect((res)=>{
        expect(res.body.todos.length).toBe(3);
      }).end(done);
  });
});

describe('Get /todos/:id', ()=>{
  it('Should return todo doc', (done)=>{
    request(app).get(`/todos/${todos[0]._id.toHexString()}`).expect(200).expect((res)=>{
      expect(res.body.todo.text).toBe(todos[0].text);
    }).end(done);
  });

  it('Should return a 404 if todo not found', (done)=> {
    request(app).get(`/todo/${new ObjectID().toHexString()}`).expect(404).end(done);
  });

  it('Should return a 404 if todo is a not-object id', (done)=> {
    request(app).get(`/todo/12345`).expect(404).end(done);
  });

});
