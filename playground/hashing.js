var {SHA256} = require("crypto-js");
var jwt = require("jsonwebtoken");
var bcrypt = require("bcryptjs");
// var text = "hallo ich bin heinrich";

// var hash = SHA256(text).toString();

// console.log(text, hash);

// var data = {
//     id: 4
// };

// var salt = "some secret";

// var token = {
//     data,
//     hash: SHA256(JSON.stringify(data) + salt).toString()
// };

// token.data.id = 5;
// token.hash = SHA256(JSON.stringify(token.data)).toString();

// var resultHash = SHA256(JSON.stringify(token.data) + salt).toString();

// if (resultHash === token.hash) {
//     console.log("not manipulated");
// } else {
//     console.log("data was changed");
// }
//console.log(token);


// var data = {
//     id: 10
// };

// var token = jwt.sign(data, "salt");
// console.log(token);

// var decoded = jwt.verify(token, "salt");
// console.log(decoded);

var passwd = "123456";

// bcrypt.genSalt(10, (err, salt) => {
//     bcrypt.hash(passwd, salt, (err, hash) => {
//         console.log(hash);
//     });
// });

var hashedPasswd = "$2a$10$fY1CSy3hQSqhMAUDzgcYM.4XmWYuHdbApUVlmgJyZA3pY26SaKSHW"

bcrypt.compare(passwd, hashedPasswd, (err, res) => {
    console.log(res);
});

// var asd = bcrypt.