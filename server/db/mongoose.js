var mongoose = require('mongoose');

mongoose.Promise = global.Promise;
mongoose.connect(process.env.MONGODB_URI || "mongodb://mintvm:27017/todoApp");

module.exports = {mongoose};