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
    text: "second todo",
    completed: true,
    completedAt: 123
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
        var text = "test todos post";

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
                expect(res.body.todo._id).toEqual(id);
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

describe("DELETE /todos/:id", () => {

    it("should delete todo by id", (done) => {
        var id = todos[0]._id.toHexString();

        request(app)
            .delete("/todos/" + id)
            .expect(200)
            .expect((res) => {
                expect(res.body.todo).toExist();
                expect(res.body.todo._id).toEqual(id);
            }).end((err, res) => {

                if(err){
                    return done(err);
                }

                Todo.findById(id).then(doc => {
                    expect(doc).toNotExist();
                    done();
                }).catch(e => {
                    done(e);
                });
            });
    });

    it("should return 404 if id is invalid", (done) => {
        request(app)
            .delete("/todos/aaa")
            .expect(404)
            .expect((res) => {
                expect(res.body.todo).toNotExist();
            })
            .end(done);
    });

    it("should return 404 if object is not found", (done) => {
        request(app)
            .delete("/todos/" + new ObjectID())
            .expect(404)
            .expect((res) => {
                expect(res.body.todo).toNotExist();
            })
            .end(done);
    });
});

describe("PATCH /todos/:id", () => {

    it("should update todo by id and set completed to true", (done) => {
        var id = todos[0]._id.toHexString();

        request(app)
            .patch("/todos/" + id)
            .send({completed: true})
            .expect(200)
            .expect((res) => {
                expect(res.body.todo).toExist();
                expect(res.body.todo.completed).toBeTruthy();
                expect(res.body.todo.completedAt).toBeA("number");
            }).end((err, res) => {

                if(err){
                    return done(err);
                }

                Todo.findById(id).then(doc => {
                    expect(doc.completed).toBeTruthy();
                    expect(doc.completedAt).toBeA("number");
                    done();
                }).catch(e => {
                    done(e);
                });
            });
    });

    it("should update todo by id and set completed to false", (done) => {
        var id = todos[1]._id.toHexString();

        request(app)
            .patch("/todos/" + id)
            .send({completed: false})
            .expect(200)
            .expect((res) => {
                expect(res.body.todo).toExist();
                expect(res.body.todo.completed).toBeFalsy();
                expect(res.body.todo.completedAt).toNotExist();
            }).end((err, res) => {

                if(err){
                    return done(err);
                }

                Todo.findById(id).then(doc => {
                    expect(doc.completed).toBeFalsy();
                    expect(doc.completedAt).toNotExist();
                    done();
                }).catch(e => {
                    done(e);
                });
            });
    });

    it("should return 404 if id is invalid", (done) => {
        request(app)
            .patch("/todos/aaa")
            .send({completed: true})
            .expect(404)
            .expect((res) => {
                expect(res.body.todo).toNotExist();
            })
            .end(done);
    });

    it("should return 404 if object is not found", (done) => {
        request(app)
            .patch("/todos/" + new ObjectID())
            .send({completed: true})
            .expect(404)
            .expect((res) => {
                expect(res.body.todo).toNotExist();
            })
            .end(done);
    });
});