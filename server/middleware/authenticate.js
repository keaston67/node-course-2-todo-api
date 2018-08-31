var {User} = require('./../models/user'); 

// middleware function for authentication
var authenticate = (req, res, next) => {
    // use req.header to get the value for the x-auth key
    var token = req.header('x-auth');
    // Model method:
    User.findByToken(token).then((user) => {
    if (!user) {
        // could use :
        // res.status(401).send();
        // easier to use this code that will stop execution and pass to catch:
        return Promise.reject()
        }
        req.user = user;
        req.token = token;
        next();
        }).catch((e) => {
            res.status(401).send();
        });
    };

    module.exports = {authenticate};