var mongoose = require('mongoose');

mongoose.Promise = global.Promise;
mongoose.connect("mongodb://mintvm:27017/todoApp");

module.exports = {mongoose};