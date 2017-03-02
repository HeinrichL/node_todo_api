const {mongoose} = require("../db/mongoose");
const validator = require("validator");
const _ = require("lodash");
var jwt = require("jsonwebtoken");
var bcrypt = require("bcryptjs");

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
    }, process.env.JWT_SECRET).toString();

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
        decoded = jwt.verify(token, process.env.JWT_SECRET);

    } catch (e) {
        return Promise.reject();
    }

    return User.findOne({
        _id: decoded._id,
        "tokens.token": token,
        "tokens.access": "auth"
    });
};

UserSchema.methods.removeToken = function (token) {
    var user = this;
    return user.update({
        $pull: {
            tokens: { token }
        }
    });
};

UserSchema.statics.findByCredentials = function (email, passwd) {
    var User = this;
    if (typeof email === "undefined" || typeof passwd === "undefined") {
        return Promise.reject();
    }

    return User.findOne({ email }).then(user => {
        if (!user) {
            return Promise.reject();
        }

        return new Promise((resolve, reject) => {
            bcrypt.compare(passwd, user.password, (err, authenticated) => {
                if (authenticated) {
                    return resolve(user);
                } else {
                    return reject();
                }
            });
        });

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
