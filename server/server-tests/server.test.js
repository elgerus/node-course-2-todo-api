const expect = require('expect');
const request = require('supertest');
const {ObjectID} = require('mongodb');

const {app} = require('./../server.js');
const {Todo} = require('./../models/todos.js');
const {User} = require('./../models/user.js');

const todos = [{ _id: new ObjectID(),
                text: 'First test todo',
                completed: false,
                completedAt: 3},
              { _id: new ObjectID(),
                text: 'Second test todo',
                completed: true,
                completedAt: 3},
              { _id: new ObjectID(),
                text: 'Third test todo',
                completed: true,
                completedAt: 3},
              { _id: new ObjectID(),
                  text: 'Forth test todo',
                  complete: false,
                  completedAt: 3},
              { _id: new ObjectID(),
                text: 'Fifth test todo',
                completed: false,
                completedAt: 3}];

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
        expect(todos.length).toBe(6);
        expect(todos[5].text).toBe(text);
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
        expect(todos.length).toBe(5);
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
        expect(res.body.todos.length).toBe(5);
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
    request(app).get(`/todos/${new ObjectID().toHexString()}`).expect(404).end(done);
  });

  it('Should return a 404 if todo is a not-object id', (done)=> {
    request(app).get(`/todos/12345`).expect(404).end(done);
  });

});

describe('PATCH /todos/:id', ()=>{
  it('Should update the todo', (done)=>{
    var hexId = todos[0]._id.toHexString();
    var sNewText = "This is the new text";
    var newTodo = {
      text: sNewText,
      completed: true
    };
    request(app).patch(`/todos/${hexId}`).send(newTodo).expect(200).expect((res)=>{
      expect(res.body.todo._id).toBe(hexId);
      expect(res.body.todo.text).toBe(sNewText);
      expect(res.body.todo.completed).toBe(true);
      expect(res.body.todo.completedAt).toBeA('number');
    }).end(done);
  });
  it('Should clear completedAt when complete is false', (done)=>{
    var hexId = todos[1]._id.toHexString();
    var sNewText = "This is the new text2";
    var newTodo = {
      text: sNewText,
      completed: false
    };
    request(app).patch(`/todos/${hexId}`).send(newTodo).expect(200).expect((res)=>{
      expect(res.body.todo._id).toBe(hexId);
      expect(res.body.todo.text).toBe(sNewText);
      expect(res.body.todo.completed).toBe(false);
      expect(res.body.todo.completedAt).toNotExist();
    }).end(done);
  });
});

describe('DELETE /todos/:id', ()=>{
  it('Should remove a todo', (done)=>{
    var hexId = todos[1]._id.toHexString();
    request(app).delete(`/todos/${hexId}`).expect(200).expect((res)=>{
      expect(res.body.todo._id).toBe(hexId);
    }).end((err, res)=>{
      if(err){
        return done(err);
      }
      Todo.findById(hexId).then((todo)=>{
        expect(todo).toNotExist();
        done();
      }).catch((e)=>{
        done(e);
      });
    })
  });
  it('Should return 404 if todo not found', (done)=>{
    request(app).delete(`/todos/${new ObjectID().toHexString()}`).expect(404).end(done);
  });

  it('Should retutn 404 if objectId is invalid', (done) => {
    request(app).delete('/todos/1234').expect(404).end(done);
  });
});
