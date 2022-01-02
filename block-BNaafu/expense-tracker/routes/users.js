var express = require('express');
const User = require('../models/User');
let bcrypt = require('bcrypt');
var router = express.Router();

/* GET users listing. */
router.get('/', function(req, res, next) {
  res.send('login success');
});

router.get('/register', (req, res, next) => {
  res.render("register");
})

router.get('/onboard', (req, res, next) => {
  res.render("onboard");
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