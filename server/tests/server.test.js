const expect = require("expect");
const request = require("supertest");
const {ObjectID} = require("mongodb");
const jwt = require("jsonwebtoken");

const {app} = require("../server");
const {Todo} = require("../models/todo");
const {User} = require("../models/user");
const {todos, populateTodos, users, populateUsers} = require("./seed");


beforeEach(populateTodos);
beforeEach(populateUsers);

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

describe("GET users/me", () => {
    it("should return user if authenticated", (done) => {
        request(app)
            .get("/users/me")
            .set("x-auth", users[0].tokens[0].token)
            .expect(200)
            .expect((res) => {
                expect(res.body._id).toBe(users[0]._id.toHexString());
                expect(res.body.email).toBe(users[0].email);
            })
            .end(done);
    });

    it("should return 401 if not authenticated", (done) => {
        request(app)
            .get("/users/me")
            .expect(401)
            .expect((res) => {
                expect(res.body).toEqual({});
            })
            .end(done);
    });
});

describe("POST users", () => {
    it("should create a user", (done) => {
        request(app)
            .post("/users")
            .send({
                email: "new@user.de", 
                password: "123456" 
            }).expect(200)
            .expect(res => {
                expect(res.headers["x-auth"]).toExist();
                expect(res.body._id).toExist();
                expect(res.body.email).toBe("new@user.de");
            })
            .end(err => {
                if(err){
                    return done(err);
                }

                User.findOne({
                    email: "new@user.de"
                }).then(user => {
                    expect(user).toExist();
                    expect(user.password).toNotBe("123456");
                    done();
                }).catch(e => {
                    done(e);
                });
            });
    });

    it("should return validation errors if request invalid", (done) => {
        request(app)
            .post("/users")
            .send({
                email: "new@user.de", 
                password: "1236" 
            }).expect(400)
            .end(done);
    });

    it("should not create user if email in use", (done) => {
        request(app)
            .post("/users")
            .send({
                email: users[0].email, 
                password: "123456" 
            }).expect(400)
            .end(done);
    });
});

describe("POST /users/login", () => {
    it("should return user and access token if credentials are correct", done => {
        request(app)
            .post("/users/login")
            .send({
                email: users[1].email, 
                password: users[1].password 
            }).expect(200)
            .expect(res => {
                expect(res.headers["x-auth"]).toBeA("string");
                expect(res.body.email).toBe(users[1].email);
                expect(res.body._id).toBe(users[1]._id.toHexString());
            })
            .end((err, res) => {
                if (err) {
                    return done(err);
                }

                User.findOne({
                    email: users[1].email
                }).then(user => {
                    expect(user.tokens[0]).toInclude({
                        access: "auth",
                        token: res.headers["x-auth"]
                    });
                    done();
                }).catch(e => {
                    done(e);
                });
            });
    });

    it("should fail if user does not exist", done => {
        request(app)
            .post("/users/login")
            .send({
                email: "not@exist.com", 
                password: "123456" 
            }).expect(401)
            .expect(res => {
                expect(res.body).toEqual({});
            })
            .end((err, res) => {
                if (err) {
                    return done(err);
                }

                User.findOne({
                    email: "not@exist.com"
                }).then(user => {
                    expect(user).toNotExist();
                    done();
                }).catch(e => {
                    done(e);
                });
            });
    });

    it("should fail if password is wrong", done => {
        request(app)
            .post("/users/login")
            .send({
                email: users[1].email, 
                password: "user1ss" 
            }).expect(401)
            .expect(res => {
                expect(res.headers["x-auth"]).toNotExist();
                expect(res.body).toEqual({});
            })
            .end((err, res) => {
                if (err) {
                    return done(err);
                }

                User.findOne({
                    email: users[1].email
                }).then(user => {
                    expect(user.tokens.length).toBe(0);
                    done();
                }).catch(e => {
                    done(e);
                });
            });
    });
});