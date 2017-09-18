const {ObjectID} = require('mongodb');
const {mongoose} = require('./../server/db/mongoose');
const {Todo} = require('./../server/models/todos');
const {User} = require('./../server/models/user');

//delete all
//Todo.remove({}).then((result)=> {
//  console.log(result);
//});

//Todo.findOneAndRemove({}).then((result)=>{
//});

Todo.findOneAndRemove({_id: ''}).then((todo)=> {
  console.log(todo);
});

//Todo.findByIdAndRemove("59bff7b253fceca3cff511ec").then((todo)=>{
//  console.log(todo);
//});
