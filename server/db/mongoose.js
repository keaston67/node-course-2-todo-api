var mongoose = require('mongoose');

// set mongoose promise library 
mongoose.Promise = global.Promise;
// mongoose connection to database
mongoose.connect(process.env.MONGODB_URI);

// export mongoose so variable is available / returned when this file is required
module.exports = {mongoose};