const {ObjectID} = require("mongodb");
const {Todo} = require("../models/todo");
const {User} = require("../models/user");
var jwt = require("jsonwebtoken");

const user1id = new ObjectID();
const user2id = new ObjectID();
const users = [{
    _id: user1id,
    email: "test@example.com",
    password: "user1pass",
    tokens: [{
        access: "auth",
        token: jwt.sign({_id: user1id, access: "auth"}, process.env.JWT_SECRET).toString()
    }]
}, {
    _id: user2id,
    email: "test2@example.com",
    password: "user2pass",
    tokens: [{
        access: "auth",
        token: jwt.sign({_id: user2id, access: "auth"}, process.env.JWT_SECRET).toString()
    }]
}]

const todos = [{
    _id: new ObjectID(),
    text: "first todo",
    _creator: user1id
}, {
    _id: new ObjectID(),
    text: "second todo",
    completed: true,
    completedAt: 123,
    _creator: user2id
}];

const populateTodos = (done) => {
    Todo.remove({}).then(() => {
        Todo.insertMany(todos)
            .then(() => {
                done();
            });
    });
};

const populateUsers = (done) => {
    User.remove({}).then(() => {
        var user1 = new User(users[0]).save();
        var user2 = new User(users[1]).save();
        
        return Promise.all([user1, user2]);      
    }).then(() => done());
};

module.exports = {todos, populateTodos, users, populateUsers};