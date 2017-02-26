const {ObjectID} = require('mongodb');

const {mongoose} = require("../server/db/mongoose");
const {Todo} = require("../server/models/todo");
const {User} = require("../server/models/user");

var id = "58b214c6a34aac18343b6e052";

// Todo.find({_id: id}).then((docs) => {
//     console.log("todos:", docs);
// });

// Todo.findOne({_id: id}).then((doc) => {
//     if(!doc){
//         return console.log("id not found");
//     }
//     console.log("todo:", doc);
// });

// if(!ObjectID.isValid(id)){
//     console.log("id is not valid");
// }

// Todo.findById(id).then((doc) => {
//     if(!doc){
//         return console.log("id not found");
//     }
//     console.log("todo:", doc);
// }).catch(e => {
//     console.log(e);
// });

id = "58b203134a4c7b23b4ed58c8";

User.findById(id).then((doc) => {
    if(!doc){
        return console.log("id not found");
    }
    console.log("todo:", doc);
}).catch(e => {
    console.log(e);
});