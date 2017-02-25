var express = require("express");
var bodyParser = require("body-parser");

var {mongoose} = require("./db/mongoose");
var {Todo} = require("./models/todo");
var {User} = require("./models/user");

var app = express();
app.use(bodyParser.json());

app.post("/todos", (req, res) => {
    //console.log(req.body);
    var todo = new Todo(req.body);
    todo.save().then((doc) => {
        res.status(201).send(doc);
    }).catch((err) => {
        res.status(400).send(err);
    })
});

//app.get("/todos")

app.listen(3000, () => {
    console.log("listen on port 3000");
});

module.exports = {app};