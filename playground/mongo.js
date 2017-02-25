//const MongoClient = require('mongodb').MongoClient;
const {MongoClient, ObjectID} = require('mongodb');

MongoClient.connect("mongodb://mintvm:27017/todoApp", (err, db) => {
    if (err) {
        return console.log(err);
    }

    console.log("Connected to todoApp database");

    db.collection("todos").insertOne({
        title: "something",
        completed: true
    }, (err, res) => {
        if (err) {
            return console.log(err);
        }

        console.log("saved", JSON.stringify(res.ops));

    });

    // db.collection("users").insertOne({
    //     name: "Heinrich",
    //     age: 23,
    //     location: "Hamburg"
    // }, (err, res) => {
    //     if (err) {
    //         return console.log(err);
    //     }

    //     console.log(res.ops[0]._id.getTimestamp());

    // });


    db.close();
});


