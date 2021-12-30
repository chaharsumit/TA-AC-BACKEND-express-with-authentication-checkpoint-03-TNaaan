let passport = require('passport');
let User = require('../models/User');
let GithubStrategy = require('passport-github').Strategy;
let GoogleStrategy = require('passport-google-oauth20').Strategy;


passport.use(new GithubStrategy({
  clientID: process.env.GITHUB_CLIENT_ID,
  clientSecret: process.env.GITHUB_CLIENT_SECRET,
  callbackURL: "/auth/github/callback"
}, (accessToken, refreshToken, profile, done) => {
  let profileData = {
    email: profile._json.email,
    name: profile.displayName,
    github: {
      username: profile._json.username,
      photo: profile._json.avatar_url,
      name: profile.displayName
    }
  };
  User.findOne({ email: profile._json.email }, (err, user) => {
    if(err){
      return done(err);
    }
    if(!user){
      User.create(profileData, (err, newUser) => {
        if(err){
          return done(err);
        }
        return done(null, newUser);
      })
    }else{
      return done(null, user);
    }
  })
}))

passport.use(new GoogleStrategy({
  clientID: process.env.GOOGLE_CLIENT_ID,
  clientSecret: process.env.GOOGLE_CLIENT_SECRET,
  callbackURL: "/auth/google/callback"
}, (accessToken, refreshToken, profile, done) => {
  let profileData = {
    email: profile._json.email,
    name: profile._json.given_name,
    google: {
      name: profile._json.given_name,
      photo: profile._json.picture,
    }
  };
  User.findOne({ email: profile._json.email }, (err, user) => {
    if(err){
      return done(err);
    }
    if(!user){
      User.create(profileData, (err, newUser) => {
        if(err){
          return done(err);
        }
        return done(null, newUser);
      })
    }else{
      return done(null, user);
    }
  })
}));

passport.serializeUser((user, done) => {
  done(null, user.id);
})

passport.deserializeUser((id, done) => {
  User.findById(id, "name email", (err, user) => {
    done(err, user);
  })
})