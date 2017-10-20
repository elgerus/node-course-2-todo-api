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
    .set('x-auth', users[0].tokens[0].token)
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
    .set('x-auth', users[0].tokens[0].token)
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
      .set('x-auth', users[0].tokens[0].token)
      .expect(200)
      .expect((res)=>{
        expect(res.body.todos.length).toBe(3);
      }).end(done);
  });
});

describe('Get /todos/:id', ()=>{
  it('Should return todo doc', (done)=>{
    request(app)
    .get(`/todos/${todos[0]._id.toHexString()}`)
    .set('x-auth', users[0].tokens[0].token)
    .expect(200).expect((res)=>{
      expect(res.body.todo.text).toBe(todos[0].text);
    }).end(done);
  });

  it('Should return a 404 if todo not found', (done)=> {
    request(app)
    .get(`/todos/${new ObjectID().toHexString()}`)
    .set('x-auth', users[0].tokens[0].token)
    .expect(404).end(done);
  });

  it('Should return a 404 if todo is a not-object id', (done)=> {
    request(app)
    .get(`/todos/12345`)
    .set('x-auth', users[0].tokens[0].token)
    .expect(404).end(done);
  });

  it('Should not return todo doc created by another user', (done)=>{
    request(app)
    .get(`/todos/${todos[0]._id.toHexString()}`)
    .set('x-auth', users[1].tokens[0].token)
    .expect(404)
    .end(done);
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
    request(app)
    .patch(`/todos/${hexId}`)
    .set('x-auth', users[0].tokens[0].token)
    .send(newTodo)
    .expect(200)
    .expect((res)=>{
      expect(res.body.todo._id).toBe(hexId);
      expect(res.body.todo.text).toBe(sNewText);
      expect(res.body.todo.completed).toBe(true);
      expect(res.body.todo.completedAt).toBeA('number');
    }).end(done);
  });

  it('Should not update the todo of other user', (done)=>{
    var hexId = todos[1]._id.toHexString();
    var sNewText = "This is the new text";
    var newTodo = {
      text: sNewText,
      completed: true
    };
    request(app)
    .patch(`/todos/${hexId}`)
    .set('x-auth', users[0].tokens[0].token)
    .send(newTodo)
    .expect(404)
    .end(done);
  });

  it('Should clear completedAt when complete is false', (done)=>{
    var hexId = todos[1]._id.toHexString();
    var sNewText = "This is the new text2";
    var newTodo = {
      text: sNewText,
      completed: false
    };
    request(app)
    .patch(`/todos/${hexId}`)
    .set('x-auth', users[1].tokens[0].token)
    .send(newTodo)
    .expect(200)
    .expect((res)=>{
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
    request(app)
    .delete(`/todos/${hexId}`)
    .set('x-auth', users[1].tokens[0].token)
    .expect(200).expect((res)=>{
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

  it('Should not remove a todo from other user', (done)=>{
    var hexId = todos[0]._id.toHexString();
    request(app)
    .delete(`/todos/${hexId}`)
    .set('x-auth', users[1].tokens[0].token)
    .expect(404).end((err, res)=>{
      if(err){
        return done(err);
      }
      Todo.findById(hexId).then((todo)=>{
        expect(todo).toExist();
        done();
      }).catch((e)=>{
        done(e);
      });
    })
  });

  it('Should return 404 if todo not found', (done)=>{
    request(app)
    .delete(`/todos/${new ObjectID().toHexString()}`)
    .set('x-auth', users[0].tokens[0].token)
    .expect(404).end(done);
  });

  it('Should return 404 if objectId is invalid', (done) => {
    request(app)
    .delete('/todos/1234')
    .set('x-auth', users[0].tokens[0].token)
    .expect(404)
    .end(done);
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
      }).catch((err)=>done(err));
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

describe('POST /user/login', ()=>{
  it('Should login user and return auth login', (done)=>{
    var email = users[1].email;
    var password = users[1].password;
    request(app)
    .post('/user/login')
    .send({email, password})
    .expect(200)
    .expect((res)=>{
        expect(res).toExist();
        expect(res.header['x-auth']).toExist();
    }).end((err, res)=>{
      if(err) return done(err);
      User.findById(users[1]._id).then((user)=>{
        expect(user.tokens[1]).toInclude({
          access: 'auth',
          token: res.header['x-auth']
        });
        done();
      }).catch((err)=>done(err));
    });
  });

  it('Should reject an invalid logic', (done)=>{
    var email = users[0].email;
    var password = 'XXXXXX';
    request(app)
    .post('/user/login')
    .send({email, password})
    .expect(400)
    .expect((res)=>{
      expect(res.header['x-auth']).toNotExist();
    }).end((err, res)=>{
      if(err) return done(err);
      User.findById(users[1]._id).then((user)=>{
        expect(user.tokens.length).toBe(1);
        done();
      }).catch((err)=>done(err));
    });
  });
})


describe('DELETE /user/me/token', ()=>{
  it('Should delete auth token', (done)=>{
    //DELETE request
    request(app)
    .delete('/user/me/token')
    .set('x-auth', users[0].tokens[0].token)
    .expect(200)
    .end((err, res) =>{
      if(err) return done(err);
      User.findById(users[0]._id).then((user)=>{
        expect(user.tokens.length).toBe(0);
        done();
      }).catch((err)=>done(err));
    });
  });
});
