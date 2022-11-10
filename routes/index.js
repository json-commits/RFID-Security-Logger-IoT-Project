var express = require('express');
var router = express.Router();
var db = require('../models/db');
var User = require('../models/UsersSchema');

/* GET home page. */
router.get('/', function(req, res, next) {
  //TODO Setup checking of a login session if no token found redirect to login

  //checkLoginToken();

  res.render('live_view', { title: 'Express' });

});

router.get('/login', function (req, res, next) {
  res.render('login', {title: 'Login'})
});

router.get('/logs', function (req, res, next) {
  res.render('logs', {title: 'Logs'})
});

router.get('/user_management', function (req, res, next) {
  res.render('user_management', {title: 'User Management'})
});

router.get('/logout', function (req, res, next) {
  //TODO Invalidate login token

  res.redirect('/login')
});

router.get('/test', function (req, res, next) {
  res.render('test')
});

router.post('/login', function (req, res, next) {
  //TODO Check login credentials and set token
  if (req.body.username === 'admin' && req.body.password === 'admin') {

    res.redirect('/');
  }
});

router.post('/add_user', function (req, res, next) {
  db.insertOne(User, req.body, function () {});
});

module.exports = router;
