var express = require('express');
var router = express.Router();
var db = require('../db')

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', { title: 'Express' });
});

outer.get('/cat', [
  // username must be an email
  check('username').isEmail(),
  // password must be at least 5 chars long
  check('password').isLength({ min: 5 })
], function(req, res, next) {
  db.query('SELECT * FROM cat', function(err, results, query) {
    if (err) throw err;
    
    if(results.length > 0) {
      res.status(200).json(results);
    }
  });
});


router.get('/cat', function(req, res, next) {
  db.query('SELECT * FROM cat', function(err, results, query) {
    if (err) throw err;
    
    if(results.length > 0) {
      res.status(200).json(results);
    }
  });
});


module.exports = router;
