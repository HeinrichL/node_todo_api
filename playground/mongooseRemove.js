const {ObjectID} = require('mongodb');

const {mongoose} = require("../server/db/mongoose");
const {Todo} = require("../server/models/todo");
const {User} = require("../server/models/user");

// Todo.remove({}).then(res => {
//     console.log(res);
// });

// Todo.findOneAndRemove({}).then(res => {
//     console.log(res);
// });

Todo.findByIdAndRemove("58b2e0f175f9d180ac97b511").then(res => {
    console.log(res);
});

