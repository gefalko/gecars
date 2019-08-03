const dataSer = require('../services/data.service');
const passport = require('passport');

module.exports.register = function(req, res) {
    return dataSer.saveUser(req.body.email, req.body.pass).then(function(token){
            res.status(200);
            res.json({
                "token" : token
            });
    });
};

module.exports.login = function(req, res) {

    // if(!req.body.email || !req.body.password) {
    //   sendJSONresponse(res, 400, {
    //     "message": "All fields required"
    //   });
    //   return;
    // }

    console.log("Try login",req.body);


    passport.authenticate('local', function(err, user, info){
        var token;

        // If Passport throws/catches an error
        if (err) {
            res.status(404).json(err);
            return;
        }

        console.log('local passport authentication. User:',user);
        // If a user is found
        if(user){
            token = user.generateJwt();
            res.status(200);
            res.json({
                "token" : token
            });
        } else {
            // If user is not found
            res.status(401).json(info);
        }
    })(req, res);

};

