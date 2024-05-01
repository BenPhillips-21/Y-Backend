const JwtStrategy = require('passport-jwt').Strategy;
const ExtractJwt = require('passport-jwt').ExtractJwt;
const User = require('../models/userModel');
const opts = {}
opts.jwtFromRequest = ExtractJwt.fromAuthHeaderAsBearerToken();
require('dotenv').config();
opts.secretOrKey = process.env.secret

module.exports = new JwtStrategy(opts, async (jwt_payload, done) => {
    try {
        const user = await User.findOne({ _id: jwt_payload.userId });
        if (user) {
            return done(null, user);
        } else {
            return done(null, false);
        }
    } catch (error) {
        return done(error, false);
    }
});