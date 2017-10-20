const {ObjectID} = require('mongodb');
const jwt = require('jsonwebtoken');
const {Todo} = require('./../../models/todos.js');
const {User} = require('./../../models/user.js')
var user1Id = new ObjectID();
var user2Id = new ObjectID();

const users = [{
  _id: user1Id,
  email: 'elgerus@test.com',
  password: 'testpassword123',
  tokens: [{
      access: 'auth',
      token: jwt.sign({_id: user1Id, access: 'auth'}, 'abc123')
    }]
},{
  _id: user2Id,
  email: 'logan@x-men.com',
  password: 'testpassword123',
  tokens: [{
      access: 'auth',
      token: jwt.sign({_id: user2Id, access: 'auth'}, 'abc123')
    }]
}]

const todos = [{ _id: new ObjectID(),
                text: 'First test todo',
                completed: false,
                completedAt: 3,
                _creator: user1Id},
              { _id: new ObjectID(),
                text: 'Second test todo',
                completed: true,
                completedAt: 3,
                _creator: user2Id},
              { _id: new ObjectID(),
                text: 'Third test todo',
                completed: true,
                completedAt: 3,
                _creator: user1Id},
              { _id: new ObjectID(),
                  text: 'Forth test todo',
                  complete: false,
                  completedAt: 3,
                  _creator: user2Id},
              { _id: new ObjectID(),
                text: 'Fifth test todo',
                completed: false,
                completedAt: 3,
                _creator: user1Id}];

const populateTodos = (done) => {
  Todo.remove({}).then(()=>{
    return Todo.insertMany(todos);
  }).then(()=> done());
};

const populateUsers = (done) =>{
  User.remove({}).then(()=>{
    var user1 = new User(users[0]).save();
    var user2 = new User(users[1]).save();
    return Promise.all([user1, user2]);
  }).then(()=>done());
};

module.exports = {todos, populateTodos, users, populateUsers};
