require("./config/config");

const _ = require("lodash");
const express = require("express");
const bodyParser = require("body-parser");
const {ObjectID} = require("mongodb");

var {mongoose} = require("./db/mongoose");
var {Todo} = require("./models/todo");
var {User} = require("./models/user");

var app = express();
const port = process.env.PORT;

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
        res.send({ todos: docs });
    }).catch(e => {
        res.status(404).send(e);
    });
});

app.get("/todos/:id", (req, res) => {
    var id = req.params.id;

    if (!ObjectID.isValid(id)) {
        return res.status(404).send();
    }
    Todo.findById(id).then(doc => {
        if (!doc) {
            return res.status(404).send();
        }
        res.send({ todo: doc });
    }).catch(e => {
        res.status(400).send({
            error: "An error occured!"
        });
    });
});

app.patch("/todos/:id", (req, res) => {
    var id = req.params.id;
    var body = _.pick(req.body, ['text', 'completed']);

    if (!ObjectID.isValid(id)) {
        return res.status(404).send();
    }

    if (_.isBoolean(body.completed) && body.completed) {
        body.completedAt = new Date().getTime();
    } else {
        body.completed = false;
        body.completedAt = null;
    }

    Todo.findByIdAndUpdate(id, { $set: body }, { new: true }).then(doc => {
        if (!doc) {
            return res.status(404).send();
        }
        res.send({ todo: doc });
    }).catch(e => {
        res.status(400).send({
            error: "An error occured!"
        });
    });
});

app.delete("/todos/:id", (req, res) => {
    var id = req.params.id;

    if (!ObjectID.isValid(id)) {
        return res.status(404).send();
    }
    Todo.findByIdAndRemove(id).then(doc => {
        if (!doc) {
            return res.status(404).send();
        }
        res.send({ todo: doc });
    }).catch(e => {
        res.status(400).send({
            error: "An error occured!"
        });
    });
});

app.listen(port, () => {
    console.log("listen on port", port);
});

module.exports = { app };