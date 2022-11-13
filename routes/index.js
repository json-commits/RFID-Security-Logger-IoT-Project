var express = require('express');
var router = express.Router();

var db = require('../models/db');
var User = require('../models/UsersSchema');
var Log = require('../models/LogsSchema')
var RecentActivity = require('../models/RecentActivitiesSchema');

/* GET home page. */
router.get('/', function(req, res, next) {
    var session = req.session;
    if(session.user === undefined){
        res.redirect('/login');
        return;
    }

  db.findMany(RecentActivity, {}, {}, function(result) {
    var recentActivityMap = result.map(result => result.toJSON());

      for (let recentActivity of recentActivityMap) {
          recentActivity.time = new Date(recentActivity.lastLoggedUnixTime).toLocaleString();
          recentActivity.location = recentActivity.lastLocation;
          recentActivity.action = recentActivity.lastAction;
      }

    res.render('live_view', { title: 'Live View', recentActivities: recentActivityMap });
  });

});

router.get('/login', function (req, res, next) {
  res.render('login', {title: 'Login'})
});

router.get('/logs', function (req, res, next) {
    var session = req.session;
    if(session.user === undefined){
        res.redirect('/login');
        return;
    }

    Log.find({}, null, {sort: {unixTime: -1}}, function (error, result) {
        var logMap = result.map(result => result.toJSON())

        for (let logMapElement of logMap) {
            console.log(logMapElement.unixTime);
            logMapElement.time = new Date(logMapElement.unixTime).toLocaleString();
        }
        res.render('logs', {title: 'Logs', logList: logMap})

    });
});

router.get('/user_management', function (req, res, next) {
    var session = req.session;
    if(session.user === undefined){
        res.redirect('/login');
        return;
    }

  db.findMany(User, {}, null, function (result) {
    res.render('user_management', {title: 'User Management', userList: result.map(result => result.toJSON())})
  });
});

router.get('/logout', function (req, res, next) {
    req.session.destroy();
  res.redirect('/login')
});

router.get('/test', function (req, res, next) {
  res.render('test')
});

router.post('/add_log', function (req, res, next) {
    var log = {
        room: req.body.room,
        user: req.body.user,
        unixTime: Date.now(),
        action: req.body.action
    };

    db.insertOne(Log, log, function (result) {
        if (result) {
            res.status(200).send('Log added');
        } else {
            res.status(500).send('Error adding log');
        }
    });

    db.findOne(RecentActivity, {'user': req.body.user}, null, function (result) {
        var recent_activity = {
            "user": log.user,
            "inAttendance": true,
            "lastLoggedUnixTime": Date.now(),
            "lastLocation": log.room,
            "lastAction": log.action
        };

        if(result) {
            console.log('Updating recent activity');
            if(log.action === 'Attendance') {
                recent_activity.inAttendance = !result.inAttendance;
            }

            db.updateOne(RecentActivity, {'user': log.user}, recent_activity, function () {});
        } else {
            console.log('Inserting recent activity');
            db.insertOne(RecentActivity, recent_activity, function () {});
        }
    });
});

router.post('/login', function (req, res, next) {
    console.log(req.body);
  if (req.body.username === 'admin' && req.body.password === 'admin') {
    req.session.user = req.body.username;
    res.redirect('/');
  }

    res.render('login', {title: 'Login', error: 'Invalid username or password'})
});

router.post('/add_user', function (req, res, next) {
  db.insertOne(User, req.body, function () {});
});

router.post('/delete_user', function (req, res, next){
  db.deleteOne(User, req.body, function () {});
});

router.post('/edit_user', function (req, res, next) {
  const toReplace = {
    user: req.body.original_user,
    uid: req.body.original_uid,
    permissions: req.body.original_permissions
  };

  const toUpdate = {
    user: req.body.user,
    uid: req.body.uid,
    permissions: req.body.permissions
  };

  db.updateOne(User, toReplace, toUpdate, function () {});
});


module.exports = router;
