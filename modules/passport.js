var passport = require("passport");
var GitHubStrategy = require("passport-github").Strategy;

var User = require("../models/User");

passport.use(
  new GitHubStrategy(
    {
      clientID: process.env.GITHUB_CLIENT_ID,
      clientSecret: process.env.GITHUB_CLIENT_SECRET,
      callbackURL: "http://localhost:3000/auth/github/callback",
    },
    (accessToken, refreshToken, profile, done) => {
      //   console.log(profile);
      var profileData = {
        name: profile.displayName,
        email: profile._json.email,
        username: profile.username,
        photo: profile._json.avatar_url,
        provider: profile.provider,
      };

      User.findOne({ email: profileData.email }, (err, user) => {
        if (err) return done(err);
        // console.log(user);
        if (!user) {
          User.create(profileData, (err, addedUser) => {
            if (err) return done(err);
            // console.log("user created");
            return done(null, addedUser);
          });
        }
        return done(null, user);
      });
    }
  )
);

passport.serializeUser((user, done) => {
  done(null, user.id);
});

passport.deserializeUser((id, done) => {
  User.findById(id, (err, user) => {
    return done(null, user);
  });
});
