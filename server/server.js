require("./config/config");

const _ = require("lodash");
const express = require("express");
const bodyParser = require("body-parser");
const { ObjectID } = require("mongodb");
var bcrypt = require("bcryptjs");

var { mongoose } = require("./db/mongoose");
var { Todo } = require("./models/todo");
var { User } = require("./models/user");
var { authenticate } = require("./middleware/authenticate");

var app = express();
const port = process.env.PORT;

app.use(bodyParser.json());

app.post("/todos", authenticate, (req, res) => {
    var todo = new Todo({
        text: req.body.text,
        completed: req.body.completed,
        _creator: req.user._id
    });
    todo.save().then((doc) => {
        res.status(201).send(doc);
    }).catch((err) => {
        res.status(400).send(err);
    });
});

app.get("/todos", authenticate, (req, res) => {
    Todo.find({
        _creator: req.user._id
    }).then(docs => {
        res.send({ todos: docs });
    }).catch(e => {
        res.status(404).send(e);
    });
});

app.get("/todos/:id", authenticate, (req, res) => {
    var id = req.params.id;

    if (!ObjectID.isValid(id)) {
        return res.status(404).send();
    }
    Todo.findOne({
        _id: id,
        _creator: req.user._id
    }).then(doc => {
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

app.patch("/todos/:id", authenticate, (req, res) => {
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

    Todo.findOneAndUpdate({
        _id: id,
        _creator: req.user._id
    }, { $set: body }, { new: true }).then(doc => {
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

app.delete("/todos/:id", authenticate, (req, res) => {
    var id = req.params.id;

    if (!ObjectID.isValid(id)) {
        return res.status(404).send();
    }
    Todo.findOneAndRemove({
        _id: id,
        _creator: req.user._id
    }).then(doc => {
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

// User
app.post("/users", (req, res) => {
    var user = new User(_.pick(req.body, ["email", "password"]));

    user.save().then(() => {
        return user.generateAuthToken();
    }).then(token => {
        res.header("x-auth", token)
            .send(user);
    }).catch((err) => {
        res.status(400).send(err);
    });
});

app.get("/users/me", authenticate, (req, res) => {
    res.send(req.user);
});

app.post("/users/login", (req, res) => {

    User.findByCredentials(req.body.email, req.body.password).then(user => {
        return user.generateAuthToken().then(token => {
            res.header("x-auth", token)
                .send(_.pick(user, ["_id", "email"]));

        }).catch(e => {
            return Promise.reject();
        });

    }).catch(e => {
        res.status(401).send();
    });
});

app.delete("/users/me/token", authenticate, (req, res) => {
    req.user.removeToken(req.token).then(() => {
        res.send();
    }, () => {
        res.status(400).send();
    });
});


app.listen(port, () => {
    console.log("listen on port", port);
});

module.exports = { app };