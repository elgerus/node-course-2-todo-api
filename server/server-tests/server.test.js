const expect = require('expect');
const request = require('supertest');

const {app} = require('./../server.js');
const {Todo} = require('./../models/todos.js');
const {User} = require('./../models/user.js');

const todos = [{text: 'First test todo'},{text: 'Second test todo'},{text: 'Third test todo'}];

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
