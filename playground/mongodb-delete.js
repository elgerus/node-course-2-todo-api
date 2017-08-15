const {MongoClient, ObjectID} = require('mongodb');


MongoClient.connect('mongodb://127.0.0.1:27017/TodoApp',(err, db)=>{
  if(err){
    return console.log('Unable to connect to mongodb server');
  }
  console.log('Connected to MongoDB server');

  //deleteMany
  // db.collection('Todos').deleteMany({text: 'Eat lunch'}).then((result)=>{
  //   console.log(result);
  // });
  //deleteOne
  // db.collection('Todos').deleteOne({text: 'Eat lunch'}).then((result)=>{
  //   console.log(result);
  // // });
  //findOneAndDelete
  // db.collection('Todos').findOneAndDelete({text: 'Eat lunch'}).then((result)=>{
  //   console.log(result);
  // });
  // db.collection('User').deleteMany({user: 'taacoca1'}).then((result)=>{
  //   console.log(result);
  // });

  db.collection('User').findOneAndDelete({_id: new ObjectID('597a63e9fcef430c1840db05')}).then((result)=>{
    console.log(JSON.stringify(result, undefined, 2));
  });
  db.close();
});
