const expect = require("expect");
const request = require("supertest");
const {ObjectID} = require("mongodb");

const {app} = require("../server");
const {Todo} = require("../models/todo");

const todos = [{
    _id: new ObjectID(),
    text: "first todo"
}, {
    _id: new ObjectID(),
    text: "second todo"
}];

beforeEach((done) => {
    Todo.remove({}).then(() => {
        Todo.insertMany(todos)
            .then(() => {
                done();
            });
    });
});

describe("POST /todos", () => {
    it("should create a new todo", (done) => {
        var text = "test todos post";

        request(app)
            .post("/todos")
            .send({ text })
            .expect(201)
            .expect((res) => {
                expect(res.body.text).toBe(text);
            })
            .end((err, res) => {
                if (err) {
                    return done(err);
                }

                Todo.find().then(docs => {
                    expect(docs.length).toBe(3);
                    expect(docs[2].text).toBe(text);
                    done();
                }).catch((err) => {
                    done(err);
                });
            })
    });

    it("should fail if todo is invalid", (done) => {
        //var text = "test todos post";

        request(app)
            .post("/todos")
            .send({})
            .expect(400)
            .end((err, res) => {
                if (err) {
                    return done(err);
                }

                Todo.find().then(docs => {
                    expect(docs.length).toBe(2);
                    done();
                }).catch((err) => {
                    done(err);
                });
            });
    });
});

describe("GET /todos", () => {
    it("should get all todos", (done) => {

        request(app)
            .get("/todos")
            .expect(200)
            .expect((res) => {
                expect(res.body.todos.length).toBe(2);
            })
            .end(done);
    });
});

describe("GET /todos/:id", () => {

    it("should get todo by id", (done) => {
        var id = todos[0]._id.toHexString();

        request(app)
            .get("/todos/" + id)
            .expect(200)
            .expect((res) => {
                expect(res.body.todo).toExist();
                expect(res.body.todo._id).toEqual(todos[0]._id);
            }).end(done);

    });

    it("should return 404 if id is invalid", (done) => {
        request(app)
            .get("/todos/aaa")
            .expect(404)
            .expect((res) => {
                expect(res.body.todo).toNotExist();
            })
            .end(done);

    });

    it("should return 404 if object is not found", (done) => {
        request(app)
            .get("/todos/" + new ObjectID())
            .expect(404)
            .expect((res) => {
                expect(res.body.todo).toNotExist();
            })
            .end(done);

    });
});