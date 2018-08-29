var mongoose = require('mongoose');

// set mongoose promise library 
mongoose.Promise = global.Promise;
// mongoose connection to database
mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/TodoApp');

// export mongoose so variable is available / returned when this file is required
module.exports = {mongoose};