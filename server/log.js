const fs = require('fs');

var logToFile = function(logTxt){
  var now = new Date().toString();
  var sText = typeof(logTxt)==="String"?logTxt:JSON.stringify(logTxt, undefined, 2);
  var sLog = `${now}: \n ${sText}`;
  fs.appendFile('server.log', sLog +'\n', (err)=>{
    if(err)console.log('Unable to append log to file');
  });
  console.log(sText);
};

module.exports = {
   logToFile: logToFile
};
