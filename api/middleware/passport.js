require('dotenv').config();
const User        = require('../models/user');
const JwtStrategy = require('passport-jwt').Strategy,
      ExtractJwt  = require('passport-jwt').ExtractJwt;
 
let opts = {
    jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
    secretOrKey: process.env.ACCESS_TOKEN_SECRET
}
 
module.exports = new JwtStrategy(opts, (jwt_payload, done) => {
    User.findById(jwt_payload._id, (err, user) => {
        if (err) {
            return done(err, false);
        }
        if (user) {
            return done(null, user);
        } else {
            return done(null, false);
        }
    });
});