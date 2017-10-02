var mongoose = require('mongoose');
mongoose.Promise = global.Promise;

// let db = {
//   localhost: 'mongodb://localhost:27017/TodoApp',
//   mlab: 'mongodb://<dbuser>:<dbpassword>@ds125774.mlab.com:25774/mongoose-for-nodejs-course'
// };
var connectURI = process.env.MONGODB_URI;
console.log(connectURI);
mongoose.connect(connectURI);
module.export = {mongoose};
