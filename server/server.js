var express = require('express');
var bodyParser = require('body-parser');

var {mongoose} = require('./db/mongoose.js');
var {User} = require('./models/user.js');
var {Todo} = require('./models/todos.js');
var {logToFile} = require('./log.js')

var app = express();

app.use(bodyParser.json());

app.post('/todos', (req, res)=>{
  console.log('/todos Pos received');
  logToFile(req.body);
  var todo = new Todo({text: req.body.text});
  todo.save().then((doc)=>{
    res.send(doc);
  },(e)=>{
    res.status(400).send(e);
  });
});

app.get('/todos', (req, res)=>{
  Todo.find().then((todos)=>{
    res.send({todos});
  }, (e)=>{
    res.status(400).send(e);
  });
});

app.listen(3000, ()=>{
  console.log('Started on port 3000');
});

module.exports = {app};
