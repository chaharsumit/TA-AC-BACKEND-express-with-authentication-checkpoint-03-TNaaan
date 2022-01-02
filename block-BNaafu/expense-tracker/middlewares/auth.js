let User = require('../models/User');

/*
module.exports = {
  UserLoggedIn: (req, res, next) => {
    if((req.session && req.session.userId) || (req.session && req.session.passport) ){
      next();
    }else{
      req.flash("kindly login first");
      res.redirect('/user/login');
    }
  },
  UserInfo: (req, res, next) => {
    let userId = req.session && req.session.userId;
    if(userId){
      User.findById(userId, "email username name" ,(err, user) => {
        if(err){
          return next(err);
        }
        req.user = user;
        res.locals.user = user;
        return next();
      })
    }else{
      res.user = null;
      res.locals.user = null;
    }
  }
}
*/

module.exports = {
  UserLoggedIn: (req, res, next) => {
    if(req.session && req.session.userId){
      return next();
    }else if(req.session && req.session.passport){
      return next();
    }else{
      req.flash('error', "You haven't logged in yet, Please login to continue!!");
      res.redirect("/users/login");
    }
  },
  userInfo: (req, res, next) => {
    let userId = req.session && req.session.userId;
    let pass = req.session && req.session.passport;
    if(userId){
      User.findById(userId, "name email", (err, user) => {
        if(err){
          return next(err);
        }
        req.user = user;
        res.locals.user = user;
        return next();
      })
    }else if(pass){
      User.findById(pass.user, "name email", (err, user) => {
        if(err){
          return next(err);
        }
        req.user = user;
        res.locals.user = user;
        return next();
      })
    }else{
      req.user = null;
      res.locals.user = null;
      next();
    }
  },
}