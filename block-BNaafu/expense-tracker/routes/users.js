var express = require('express');
const User = require('../models/User');
var auth = require("../middlewares/auth");
var bcrypt = require('bcrypt');
const Income = require('../models/Income');
const Expense = require('../models/Expense');
var router = express.Router();

/* GET users listing. */
router.get('/', function(req, res, next) {
  res.send('login success');
});

router.get('/register', (req, res, next) => {
  res.render("register");
})

router.get('/onboard', auth.UserLoggedIn, (req, res, next) => {
  res.render("onboard");
})

router.get('/income', auth.UserLoggedIn, (req, res, next) => {
  res.render('income');
})

router.post('/income', auth.UserLoggedIn, (req, res, next) => {
  let userId = req.session.userId || req.session.passport.user;
  req.body.userId = userId;
  req.body.source = req.body.source.trim().split(" ");
  Income.create(req.body, (err, income) => {
    if(err){
      return next(err);
    }
    res.redirect('/users/onboard');
  });
})

router.get('/expense', auth.UserLoggedIn, (req, res, next) => {
  res.render('expense');
})

router.post('/expense', auth.UserLoggedIn, (req, res, next) => {
  let userId = req.session.userId || req.session.passport.user;
  req.body.userId = userId;
  req.body.category = req.body.category.trim().split(" ");
  Expense.create(req.body, (err, expense) => {
    if(err){
      return next(err);
    }
    res.redirect('/users/onboard');
  });
})

router.post('/', (req, res, next) => {
  let { email } = req.body;
  User.findOne({ email }, (err, user) => {
    if(err){
      return next(err);
    }
    if(!user){
      User.create(req.body, (err, user) => {
        if(err){
          return next(err);
        }
        return res.redirect('/users/login');
      });
    }
    bcrypt.hash(req.body.password, 10, (err, hashedValue) => {
      req.body.password = hashedValue;
      User.findOneAndUpdate({email}, req.body, (err, user) => {
        if(err){
          return next(err);
        }
        res.redirect('/users/login');
      });
    })
  })
})


router.get('/login', (req, res, next) => {
  res.render('login');
})

router.post('/login', (req, res, next) => {
  let { email, password } = req.body;
  if(!email || !password){
    return res.redirect('/users/login');
  }
  User.findOne({email}, (err, user) => {
    if(err){
      return next(err);
    }
    if(!user){
      return res.redirect('/users/login');
    }
    user.verifyPassword(password, (err, result) => {
      if(err){
        return next(err);
      }
      if(!result){
        return res.redirect('/users/login');
      }
      req.session.userId = user.id;
      res.redirect('/users/onboard');
    })
  })
})

router.get('/logout', (req, res, next) => {
  req.session.destroy();
  res.clearCookie("connect.sid");
  res.redirect('/');
})

module.exports = router;