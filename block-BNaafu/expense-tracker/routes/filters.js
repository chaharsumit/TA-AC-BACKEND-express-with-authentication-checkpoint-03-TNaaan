let express = require('express');
const Income = require('../models/Income');
const Expense =  require('../models/Expense');
var auth = require('../middlewares/auth');
const { route } = require('.');

let router = express.Router();

router.post('/FromTo', auth.UserLoggedIn, (req, res, next) => {
  let from = new Date(req.body.from);
  let id = req.session.userId || req.session.passport.user;
  let to = new Date(req.body.to);
  console.log(from , to);
  Income.find({userId: id, date: {$gte: from, $lte: to}}, (err, incomes) => {
    if(err){
      return next(err);
    }
    res.send(incomes);
  })
});

router.post('/FromToAndCategory', auth.UserLoggedIn, (req, res, next) => {
  let from = new Date(req.body.from);
  let id = req.session.userId || req.session.passport.user;
  let to = new Date(req.body.to);
  Expense.find({userId: id, date: {$gte: from, $lte: to}, category: {$in: req.body.category}}, (err, expenses) => {
    if(err){
      return next(err);
    }
    res.send(expenses);
  })
});


router.post('/currentMonth', auth.UserLoggedIn, (req, res, next) => {
  let id = req.session.userId || req.session.passport.user;
  let month = req.body.month + "-01";
  let endDate = req.body.month.split("-")[0] + "-0" + (Number(req.body.month.split('-')[1]) + 1) + "-01";
  console.log(endDate);
  let start = new Date(month);
  let end = new Date(endDate);
  console.log(start, end);
  Income.find({userId: id, date: {$gte: start, $lte: end}}, (err, incomes) => {
    if(err){
      return next(err);
    }
    Expense.find({userId: id, date: {$gte: start, $lte: end}}, (err, expenses) => {
      if(err){
        return next(err);
      }
      res.send({ incomes, expenses });
    })
  })
});

router.post('/source', (req, res, next) => {
  let id = req.session.userId || req.session.passport.user;
  Income.find({userId: id, source: {$in: req.body.source}}, (err, incomes) => {
    if(err){
      return next(err);
    }
    res.send(incomes);
  })
})

router.post('/category', (req, res, next) => {
  let id = req.session.userId || req.session.passport.user;
  Expense.find({userId: id, category: {$in: req.body.category}}, (err, expenses) => {
    if(err){
      return next(err);
    }
    res.send(expenses);
  })
})



module.exports = router;