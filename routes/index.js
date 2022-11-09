var express = require('express');
var router = express.Router();

/* GET home page. */
router.get('/', function(req, res, next) {

  // Cookies that have not been signed
  console.log('Cookies: ', req.cookies)

  // Cookies that have been signed
  console.log('Signed Cookies: ', req.signedCookies)


  res.render('index', { title: 'Express' });
});

router.get('/test', function (req, res, next) {
  res.render('test')
});

module.exports = router;
