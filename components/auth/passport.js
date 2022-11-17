const passport = require("passport");
const LocalStrategy = require("passport-local").Strategy;
const JwtStrategy = require("passport-jwt").Strategy;
const ExtractJwt = require('passport-jwt').ExtractJwt;
const bcrypt = require("bcrypt");
require("dotenv").config();
const usersService = require("../users/usersService");


passport.use(new LocalStrategy({usernameField: 'email', passwordField: 'password'},
    async function(username, password, done) {
        try {
            const user = await usersService.checkUsers(username);
            if (!user) {
                return done(null, false, { message: 'Incorrect username.' });
            }
            
            const match = await validPassword(user, password);
            
            if (!match) {
                return done(null, false, { message: 'Incorrect password.' });
            }

            return done(null, user);
        }
        catch (err) {
            return done(err, false);
        }
    })
);

function validPassword(user, password) {
    return bcrypt.compare(password, user.users_password);
}

var opts = {}
opts.jwtFromRequest = ExtractJwt.fromAuthHeaderAsBearerToken();
opts.secretOrKey = process.env.SECRET_KEY;

passport.use(new JwtStrategy(opts, async function(jwt_payload, done) {
    try
    {
        const user = await usersService.checkUsers(jwt_payload.user.email)
        if (user !== null) 
        {
            return done(null, user);
        } 
        else 
        {
            return done(null, false);
        }
    }
    catch(err){
        return done(err, false)
    }

}));

module.exports = passport;