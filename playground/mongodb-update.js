const {MongoClient, ObjectID} = require('mongodb');


MongoClient.connect('mongodb://127.0.0.1:27017/TodoApp',(err, db)=>{
  if(err){
    return console.log('Unable to connect to mongodb server');
  }
  console.log('Connected to MongoDB server');

  // db.collection('Todos').findOneAndUpdate(
  //   {_id: new ObjectID("597a6645d844269bd27d9a4c")},
  //   {$set:
  //     {completed: true}
  //   },
  //   {returnOriginal: false}
  // ).then((result)=>{
  //   console.log(result);
  // });

  db.collection('User').findOneAndUpdate(
    {_id: "123potato"},
    {
      $inc:{age: 1},
      $set: {location: "Lisboa, Portugal"}
    },
    {returnOriginal: false}
  ).then((result)=>{
    console.log(result);
  });

  db.close();
});
