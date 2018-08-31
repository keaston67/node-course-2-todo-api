const {SHA256} = require('crypto-js');
// JWT Library
const jwt = require('jsonwebtoken');

var data = {
    id: 10
};

var token = jwt.sign(data, '123abc');
console.log(token);
// JWT utility functions:
jwt.sign
jwt.verify

var decoded = jwt.verify(token, '123abcc');
console.log(decoded);

// var message =  'I am user number 3';
// // SHA256 method returns an object - we convert to string with .toString
// var hash = SHA256(message).toString();

// console.log(`Message: ${message}`);
// console.log(`Hash: ${hash}`);

// var data = {
//     id: 4
// };
// //  create token
// var token = {
//     data,
//     hash: SHA256(JSON.stringify(data) + 'somesecret').toString()
// }
 
// //  some user manipulates data
// token.data.id = 5;
// //  if don't know secret
// token.hash = SHA256(JSON.stringify(token.data)).toString();
// // if do know secret
// // token.hash = SHA256(JSON.stringify(token.data) + 'somesecret').toString();

// //  Check data not changed
// var resultHash = SHA256(JSON.stringify(token.data) + 'somesecret').toString();

// if (resultHash === token.hash) {
//     console.log('Data was not changed');
// } else {
//     console.log('Data was changed. Don\'t trust!');
// }
