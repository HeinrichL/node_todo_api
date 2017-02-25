//const MongoClient = require('mongodb').MongoClient;
const {MongoClient, ObjectID} = require('mongodb');

MongoClient.connect("mongodb://mintvm:27017/todoApp", (err, db) => {
    if (err) {
        return console.log(err);
    }

    console.log("Connected to todoApp database");

    // db.collection("todos").find({completed: true}).toArray()
    //     .then((docs) => {
    //         console.log(docs);
    //     }).catch((err) => {
    //         console.log(err);
    //     });

    db.collection("users").find({name: "Heinrich"}).count()
        .then((docs) => {
            console.log("count: ", docs);
        }).catch((err) => {
            console.log(err);
        });


    db.close();
});


