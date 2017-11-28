require('./config/config.js');
const _ = require('lodash');
const express = require('express');
const bodyParser = require('body-parser');
const {ObjectID} = require('mongodb');

var {mongoose} = require('./db/mongoose.js');
var {User} = require('./models/user.js');
var {Todo} = require('./models/todos.js');
var {logToFile} = require('./log.js');
var {authenticate} = require('./middleware/authenticate.js');

var app = express();
const port = process.env.PORT;

app.use(bodyParser.json());

app.post('/todos', authenticate, async (req, res)=>{
  try{
    const todo = new Todo({
      text: req.body.text,
      _creator: req.user._id});
    const doc = await todo.save();
    res.send(doc);
  }
  catch(e){
    res.status(400).send(e);
  }
});

app.get('/todos', authenticate, async (req, res)=>{
  try{
    const todos = await Todo.find({_creator: req.user._id});
    res.send({todos});
  } catch(e){
    res.status(400).send(e);
  }
});

app.get('/todos/:id', authenticate, async (req, res)=>{
  try{
    var id = req.params.id;
    if(!ObjectID.isValid(id)){
      return res.status(404).send();
    }
    const todo = await Todo.findOne({_id: id,_creator: req.user._id});
    if(!todo){
      return res.status(404).send();
    }
    res.send({todo});
  } catch(e){
    console.log("Error get by id", e);
    res.status(400).send();
  }
});

app.delete('/todos/:id', authenticate, async (req, res)=>{
  try{
    var id = req.params.id;
    if(!ObjectID.isValid(id)){
      return res.status(404).send();
    }
    const todo = await Todo.findOneAndRemove({_id: id,_creator: req.user._id});
    if(!todo)return res.status(404).send();
    res.send({todo});
  }  catch(e) {
    console.log("Error delete", e);
    res.status(404).send();
  }
});

app.patch('/todos/:id', authenticate, async (req, res)=>{
  try{
    var id = req.params.id;
    var body = _.pick(req.body, ['text', 'completed']);
    if(!ObjectID.isValid(id)){
      return res.status(404).send();
    }
    if(_.isBoolean(body.completed) && body.completed){
      body.completedAt = new Date().getTime();
    } else {
      body.completed = false;
      body.completedAt = null;
    }
    const todo = await Todo.findOneAndUpdate({
      _id: id,
      _creator: req.user._id},
      {$set: body},
      {new: true});
    if(!todo){
        return res.status(404).send();
      }
      res.send({todo});
  } catch(e){
    res.status(400).send();
  }
});

app.post('/user',async (req, res)=>{
  try{
    const body = _.pick(req.body, ['email','password']);
    const user = new User(body);
    await user.save();
    const token = user.generateAuthToken();
    res.header('x-auth', token).send(user);
  } catch(e){
    res.status(400).send(e);
  }
});

app.get('/user/me', authenticate, (req, res)=>{
  res.send(req.user);
});

app.post('/user/login', async (req, res)=>{
  try{
    const body = _.pick(req.body, ['email', 'password']);
    const user =  await User.findByCredentials(body.email, body.password);
    const token = await user.generateAuthToken();
    res.header('x-auth', token).status(200).send(user);
  }
  catch(e){
    res.status(400).send();
  }
});

app.delete('/user/me/token', authenticate, async (req, res)=>{
  try{
    await req.user.removeToken(req.token);
    res.status(200).send();
  } catch(e) {
    rest.status(400).send();
  }
});

app.listen(port, ()=>{
  console.log(`Started on port ${port}`);
});

module.exports = {app};
