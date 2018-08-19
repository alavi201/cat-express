var express = require('express');
var router = express.Router();
var db = require('../db');
var crypto = require('crypto');
const { check, validationResult } = require('express-validator/check');

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', { title: 'Express' });
});

router.post('/cat/register', [
  // username must be an email
  check('username').isEmail(),
  // password must be at least 5 chars long
  check('password').isLength({ min: 8 }),
  check('name').isAlpha(),
  check('weight').isNumeric(),
  check('breed').optional().isAlpha(),
  check('imageUrl').optional().isURL(),
], function(req, res, next) {

  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(422).json({ errors: errors.array() });
  }

  var username = req.body.username;

  db.query('SELECT id FROM cat WHERE username = ? ', [username], function(err, results, query) {
    if (err){
      console.log(error);
      res.status(500).json({"Error": "Unexpected error occured. Please try again in a while"});
    }
    
    if(results.length == 0) {
      var post  = {
        name: req.body.name,
        username: username,
        password: crypto.createHash('md5').update(req.body.username).digest("hex"),
        breed: req.body.breed,
        weight: req.body.weight,
        imageUrl: req.body.username,
      };
      
      db.query('INSERT INTO cat SET ?', post, function(err, result) {
        if (err){
          console.log(err);
          res.status(500).json({"Error": "Unexpected error occured. Please try again in a while"});
        }

        res.sendStatus(200);
      });
    } else{
      res.status(200).json({"Error": "Username already exists. Please choose a different username."});
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

router.get('/cats/random', function(req, res, next) {
  db.query('SELECT imageUrl, name, breed FROM cat ORDER BY RAND() LIMIT 1', function(err, results, query) {
    if (err){
      console.log(err);
      res.status(500).json({"Error": "Unexpected error occured. Please try again in a while"});
    }
    
    if(results.length > 0) {
      res.status(200).json(results);
    } else{
      res.status(200).json({"Error": "No records found."});
    }
  });
});


module.exports = router;
