const fs = require('fs');
console.log('called function');
var logToFile = (logTxt)=>{
  console.log('start');
  var now = new Date().toString();
  var sText = Typeof(logTxt)==="String"?logTxt:JSON.stringify(logTxt, undefined, 2);
  var sLog = `${now}: \n ${sText}`;
  fs.appendFile('server.log', sLog +'\n', (err)=>{
    if(err)console.log('Unable to append log to file');
  });
  console.log(sText);
};

logToFile("test");

// module.export = {
//     logToFile: logToFile
// };
