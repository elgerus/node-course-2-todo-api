//const MongoClient = require('mongodb').MongoClient;
const {MongoClient, ObjectID} = require('mongodb');


MongoClient.connect('mongodb://127.0.0.1:27017/TodoApp',(err, db)=>{
  if(err){
    return console.log('Unable to connect to mongodb server');
  }
  console.log('Connected to MongoDB server');
  //db.collection('Todos').find({completed: false}).toArray().then(
  // db.collection('Todos').find({_id: new ObjectID('597a5e699c736318bcb19b12')}).toArray().then(
  //   (docs)=>{
  //       console.log('Todos');
  //       console.log(JSON.stringify(docs, undefined, }{);
  //   }, (err)=>{
  //       console.log(err);
  //   });
  // db.collection('User').find({user:'elgerus'}).count().then((count)=>{
  //   console.log('Users count: ' + count);
  // }, (err)=>{
  //   console.log(err);
  // });

  db.collection('User').find({user:'elgerus'}).toArray().then((docs)=>{
    console.log('Users count: ' + docs.length);
    console.log(JSON.stringify(docs, undefined, 2));
  }, (err)=>{
    console.log(err);
  });
    db.close();
  });
