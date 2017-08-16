//const MongoClient = require('mongodb').MongoClient;
const {MongoClient, ObjectID} = require('mongodb');


// MongoClient.connect('mongodb://127.0.0.1:27017/TodoApp',(err, db)=>{
//   if(err){
//     return console.log('Unable to connect to mongodb server');
//   }
//     console.log('Connected to MongoDB server');
// //     db.collection('Todos').insertOne({
// //         text: 'Something to do',
// //         completed: false}
// //     ,(err,res)=>{
// //       if(err){
// //         return console.log('Unable to insert Todos', err);
// //       }
// //       console.log(JSON.stringify(res.ops, undefined, 2));
// //     });
//     db.collection('User').insertOne({
//       user: 'elgerus',
//       name: 'Aingeru',
//       lastName: 'Sabando',
//       age: 35,
//       location: 'Bern Switzerland'
//     }, (err,res)=>{
//       if(err){
//         return console.log('Unable to insert Todos', err);
//       }
//       console.log(JSON.stringify(res.ops, undefined, 2));
//       console.log(res.ops[0]._id.getTimestamp());
//     });
//    db.close();
//  });
