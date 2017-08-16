const {ObjectID} = require('mongodb');
const {mongoose} = require('./../server/db/mongoose');
const {Todo} = require('./../server/models/todos');
const {User} = require('./../server/models/user');

//var id = '5993c3ec31341b1f50a3a0c8';
//var id = '6993c3ec31341b1f50a3a0c8';
// var id = '5993c3ec31341b1f50a3a0c8afsdfafaaafafa';
// if(!ObjectID.isValid(id)){
//   console.log('Id is not valid.');
// }
// Todo.find({_id: id}).then((todos)=>{
//   if(todos.length < 1){
//     return console.log('Id not found');
//   }
//   console.log('Todos\n', todos);
// });
//
// Todo.findOne({_id: id}).then((todo)=>{
//   if(!todo){
//     return console.log('Id not found');
//   }
//   console.log('Todo one', todo);
// });
//
// Todo.findById(id).then((todo)=>{
//   if(!todo){
//     return console.log('Id not found');
//   }
//   console.log('Todo by id', todo);
// }).catch((e)=>{
//   console.log("Error: " + e);
// });
var id ='5993c78477b1d2fda0713f94';

User.findById(id).then((user)=>{
  if(!user){
      return console.log('User not found');
  }
  console.log('User by id', user)
}).catch((e)=>{
  console.log("Error: ", e);
});
