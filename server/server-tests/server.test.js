const expect = require('expect');
const request = require('supertest');
const {ObjectID} = require('mongodb');

const {app} = require('./../server');
const {Todo} = require('./../models/todos');
const {User} = require('./../models/user');
const {todos, populateTodos, users, populateUsers} = require('./seed/seed');

beforeEach(populateUsers);
beforeEach(populateTodos);

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

describe('GET /user/me', ()=>{
  it('Should return user if authenticated', (done)=>{
    request(app).get('/user/me')
    .set('x-auth', users[0].tokens[0].token)
    .expect(200)
    .expect((res)=>{
      expect(res.body._id).toBe(users[0]._id.toHexString());
      expect(res.body.email).toBe(users[0].email);
    }).end(done);
  });

  it('Should return 401 if not authenticated', (done)=>{
    request(app).get('/user/me')
    .expect(401)
    .expect((res)=>{
      expect(res.body).toEqual({});
    }).end(done);
  });
});

describe('POST /user', ()=>{
  it('Should create a new user', (done)=>{
    var email = 'example@example.com';
    var password = 'password123';
    request(app)
    .post('/user')
    .send({email, password})
    .expect(200)
    .expect((res)=>{
      expect(res.headers['x-auth']).toExist();
      expect(res.body._id).toExist();
      expect(res.body.email).toBe(email);
    }).end((err)=>{
      if(err){
        return done(err);
      }
      User.findOne({email}).then((user)=>{
        expect(user).toExist();
        expect(user.password).toNotBe(password);
        done();
      });
    });
  });

  it('Should return validation errors if request invalid', (done)=>{
    var password = '123';
    var email = 'potato';
    request(app)
    .post('/user')
    .send({email, password})
    .expect(400)
    .end(done);
  });

  it('Should not create a user if email is already in use', (done)=>{
    var password = 'password123';
    var email = users[0].email;
    request(app)
    .post('/user')
    .send({email, password})
    .expect(400)
    .end(done);
  })
});
