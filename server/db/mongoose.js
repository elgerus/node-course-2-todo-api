var mongoose = require('mongoose');
mongoose.Promise = global.Promise;

let db = {
  localhost: 'mongodb://localhost:27017/TodoApp',
  mlab: 'mongodb://<dbuser>:<dbpassword>@ds125774.mlab.com:25774/mongoose-for-nodejs-course'
};
mongoose.connect( process.env.MONGODB_URI || db.mlab);
module.export = {mongoose};
