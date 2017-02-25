const {MongoClient, ObjectID} = require('mongodb');

MongoClient.connect("mongodb://mintvm:27017/todoApp", (err, db) => {
    if (err) {
        return console.log(err);
    }

    console.log("Connected to todoApp database");

    db.collection("users").deleteMany({name: "Hans"})
        .then((res) => {
            console.log("deleted", res.deletedCount, "documents");
        });

    db.collection("users")
        .findOneAndDelete({_id: new ObjectID("58b1ddaf42190b1584d514bc")})
        .then((res) => {
            console.log("deleted", res.value, "documents");
        });

    db.close();
});


