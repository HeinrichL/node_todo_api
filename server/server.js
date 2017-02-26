var express = require("express");
var bodyParser = require("body-parser");
var {ObjectID} = require("mongodb")

var {mongoose} = require("./db/mongoose");
var {Todo} = require("./models/todo");
var {User} = require("./models/user");

var app = express();
const port = process.env.PORT || 3000;

app.use(bodyParser.json());

app.post("/todos", (req, res) => {
    var todo = new Todo(req.body);
    todo.save().then((doc) => {
        res.status(201).send(doc);
    }).catch((err) => {
        res.status(400).send(err);
    })
});

app.get("/todos", (req, res) => {
    Todo.find().then(docs => {
        res.send({todos: docs});
    }).catch(e => {
        res.status(404).send(e);
    });
});

app.get("/todos/:id", (req, res) => {
     var id = req.params.id;
    
    if(!ObjectID.isValid(id)){
        return res.status(404).send();
    }
    Todo.findById(id).then(doc => {
        if(!doc){
            return res.status(404).send();
        }
        res.send({todo: doc});
    }).catch(e => {
        res.status(400).send({
            error: "An error occured!"
        });
    });
});

app.listen(port, () => {
    console.log("listen on port", port);
});

module.exports = {app};