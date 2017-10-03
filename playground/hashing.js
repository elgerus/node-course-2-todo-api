const {SHA256} = require('crypto-js');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');

var password = '123abc';


// bcrypt.genSalt(10, (err, salt)=>{
//   bcrypt.hash(password, salt, (err, hash)=>{
//     console.log(hash);
//   });
// });

var hashedPassword = '$2a$10$jJv5ceyQQ7mckJbDz8.phuxQRQRLF8ZgXySyOCTQidr08nAv8q5jm';

bcrypt.compare('123abcx', hashedPassword, (err, res) =>{
  console.log(res);
})

// var data = {
//   id: 18
// };

// var token = jwt.sign(data, '123abc');
// console.log(token);
// var decoded = jwt.verify(token, '123abc');
// console.log('decoded', decoded);
// var msg = "I am user number 3";
//
// var hash = SHA256(msg).toString();
//
// console.log(`message ${msg}`);
// console.log(`hash ${hash}`);
//
// var data = {
//   id: 4
// };
//
// var token = {
//   data,
//   hash: SHA256(JSON.stringify(data) + 'some-secrect').toString()
// };
//
// // token.data.id = 5;
// // token.hash = SHA256(JSON.stringify(token.data)).toString();
//
// var resultHash = SHA256(JSON.stringify(token.data) + 'some-secrect').toString();
//
// if(resultHash === token.hash){
//   console.log("Data OK");
// } else {
//   console.log("Data manipulated, do not trust");
// }
