var env = process.env.NODE_ENV||"development";

if(env === 'development' || env=== 'test'){
    var config = require('./config.json');
    var envConfig = config[env];
    Object.keys(envConfig).forEach((key)=>{
      process.env[key] = envConfig[key];
    })
}

console.log("env ******", env);
console.log("db ******", process.env.MONGODB_URI);
console.log("port ******", process.env.PORT);
