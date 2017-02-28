const {mongoose} = require("../db/mongoose");
const validator = require("validator");
const _ = require("lodash");
var jwt = require("jsonwebtoken");
var bcrypt = require("bcryptjs");

//{
//     email: "valid@mail.de",
//     password: "mypassword123",
//     tokens: [{
//         access: "auth",
//         token: "87sa9f8uz89aw89f89fah4f89h"
//     }]
// }

var UserSchema = new mongoose.Schema({
    email: {
        type: String,
        required: true,
        trim: true,
        minlength: 1,
        unique: true,
        validate: {
            validator: validator.isEmail
        },
        message: "${VALUE} is not an valid email address"
    },
    password: {
        type: String,
        require: true,
        minlength: 6
    },
    tokens: [{
        access: {
            type: String,
            required: true
        },
        token: {
            type: String,
            required: true
        }
    }]
});

UserSchema.methods.generateAuthToken = function () {
    var user = this;
    var access = "auth";
    var token = jwt.sign({
        _id: user._id.toHexString(),
        access
    }, "abc123").toString();

    user.tokens.push({ access, token });

    return user.save().then(() => {
        return token;
    });
};

UserSchema.methods.toJSON = function () {
    var user = this;
    var userObj = user.toObject();

    return _.pick(userObj, ["_id", "email"]);
};

UserSchema.statics.findByToken = function (token) {
    var User = this;
    var decoded;
    try {
        decoded = jwt.verify(token, "abc123");

    } catch (e) {
        return Promise.reject();
    }

    return User.findOne({
        _id: decoded._id,
        "tokens.token": token,
        "tokens.access": "auth"
    });
};

UserSchema.pre("save", function (next) {

    var user = this;
    if (user.isModified("password")) {
        var passwd = user.password;
        bcrypt.genSalt(10, (err, salt) => {
            bcrypt.hash(passwd, salt, (err, hash) => {
                user.password = hash;
                next();
            }) 
        })
    } else {
        next();
    }

});
var User = mongoose.model("User", UserSchema);

module.exports = { User };
