const passport = require("passport");
const LocalStrategy = require("passport-local").Strategy;
const JwtStrategy = require("passport-jwt").Strategy;
const { ExtractJwt } = require("passport-jwt");
const GoogleStrategy = require("passport-google-oauth20").Strategy;
const bcrypt = require("bcrypt");
require("dotenv").config();
const usersService = require("../users/usersService");

function validPassword(user, password) {
  return bcrypt.compare(password, user.users_password);
}

passport.use(
  new LocalStrategy(
    { usernameField: "email", passwordField: "password" },
    async (username, password, done) => {
      try {
        const user = await usersService.checkUsers(username);
        if (!user) {
          return done(null, false, { message: "Incorrect username." });
        }

        const match = await validPassword(user, password);

        if (!match) {
          return done(null, false, { message: "Incorrect password." });
        }

        return done(null, user);
      } catch (err) {
        return done(err, false);
      }
    }
  )
);

const opts = {};
opts.jwtFromRequest = ExtractJwt.fromAuthHeaderAsBearerToken();
opts.secretOrKey = process.env.SECRET_KEY;

passport.use(
  new JwtStrategy(opts, async (jwtPayload, done) => {
    try {
      const user = await usersService.checkUsers(jwtPayload.user.email);
      if (user !== null) {
        return done(null, user);
      }
      return done(null, false);
    } catch (err) {
      return done(err, false);
    }
  })
);

passport.use(
  new GoogleStrategy(
    {
      clientID: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
      callbackURL: "/auth/login/google/callback",
      passReqToCallback: true
    },
    async function (request, accessToken, refreshToken, profile, done) {
      try {
        const user = await usersService.checkUsers(profile.emails[0].value);

        if (user === null) {
          const newUser = await usersService.resgisterUsersByGoogleAccount(
            profile.displayName,
            profile.emails[0].value
          );
          return done(null, newUser);
        }
        return done(null, user);
      } catch (err) {
        return done(err, false);
      }
    }
  )
);

passport.serializeUser((user, done) => {
  done(null, user);
});

passport.deserializeUser((user, done) => {
  done(null, user);
});

module.exports = passport;
