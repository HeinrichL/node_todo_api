const expect = require("expect");
const request = require("supertest");

const {app} = require("../server");
const {Todo} = require("../models/todo");

beforeEach((done) => {
    Todo.remove({}).then(() => {
        done();
    });
})

describe("post todos", () => {
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
                    expect(docs.length).toBe(1);
                    expect(docs[0].text).toBe(text);
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
            .send({ })
            .expect(400)
            .end((err, res) => {
                if (err) {
                    return done(err);
                }

                Todo.find().then(docs => {
                    expect(docs.length).toBe(0);
                    done();
                }).catch((err) => {
                    done(err);
                });
            })
    });
});