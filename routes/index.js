var express = require('express');
var router = express.Router();
var db = require('../db');
var crypto = require('crypto');
const { check, validationResult } = require('express-validator/check');
var jwt = require('jsonwebtoken');
var config= require('../config.json');

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
  check('birthdate').optional().isISO8601()
], function(req, res, next) {

  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(422).json({ errors: errors.array() });
  }

  var username = req.body.username;

  db.query('SELECT id FROM cat WHERE username = ? ', [username], function(err, results, query) {
    if (err){
      console.log(error);
      return res.status(500).json({"Error": "Unexpected error occured. Please try again in a while"});
    }
    
    if(results.length == 0) {
      var post  = {
        name: req.body.name,
        username: username,
        password: crypto.createHash('md5').update(req.body.password).digest("hex"),
        breed: req.body.breed,
        weight: req.body.weight,
        imageUrl: req.body.imageUrl,
        birthdate: req.body.birthdate,
      };
      
      db.query('INSERT INTO cat SET ?', post, function(err, result) {
        if (err){
          console.log(err);
          return res.status(500).json({"Error": "Unexpected error occured. Please try again in a while"});
        }

        return res.sendStatus(200);
      });
    } else{
      return res.status(200).json({"Error": "Username already exists. Please choose a different username."});
    }
  });
});

router.post('/cat/login', function(req, res, next) {

  var username = req.body.username;
  var password = crypto.createHash('md5').update(req.body.password).digest("hex");

  db.query('SELECT id, password from cat where username = ?', [username], function(err, results, query) {
    if (err){
      console.log(err);
      return res.status(500).json({"Error": "Unexpected error occured. Please try again in a while"});
    }
    
    if(results.length > 0) {
      if(results[0].password == password){
        db.query('UPDATE cat set lastSeenAt = NOW() where id = ?', [results[0].id]);
        // create a token
        var token = jwt.sign({ id: results[0].id }, config.secret, {
          expiresIn: 600 // expires in 10 minutes
        });
        return res.status(200).json({"authToken": token});
      } else{
        return res.status(200).json({"Error": "Incorrect password."});
      }
    } else{
      return res.status(200).json({"Error": "Username not found."});
    }
  });
});

router.get('/cats', function(req, res, next) {

  var authToken = req.header('authToken');
  console.log(authToken);

  if (!authToken){
    return res.status(401).json({"Error": "No token provided."});
  };

  jwt.verify(authToken, config.secret, function(err, decoded) {
    if (err){
      console.log(err);
      var message = "Failed to authenticate";
      if(err.name == "TokenExpiredError"){
        message = " This token has expired, please get a new token by logging in.";
      }
      return res.status(500).json({"Error": message});
    }

    var sql = "SELECT id, username, name, birthdate, breed, imageUrl from cat ";
    const existingParams = ["id", "name", "username"].filter(field => req.query[field]);

    if (existingParams.length) {
        sql += " WHERE ";
        sql += existingParams.map(field => `${field} = ?`).join(" AND ");
    }

    sql += " ORDER BY lastSeenAt";

    db.query(sql, existingParams.map(field => req.query[field]), function(err, results, query) {
      if (err){
        console.log(err);
        return res.status(500).json({"Error": "Unexpected error occured. Please try again in a while"});
      }
      
      if(results.length > 0) {
        return res.status(200).json(results);
      } else{
        return res.status(200).json({"Error": "Invalid search criteria"});
      }
    });
  });
});

router.get('/cat', function(req, res, next) {
  db.query('SELECT * FROM cat', function(err, results, query) {
    if (err) throw err;
    
    if(results.length > 0) {
      return res.status(200).json(results);
    }
  });
});

router.get('/cats/random', function(req, res, next) {
  db.query('SELECT imageUrl, name, breed FROM cat ORDER BY RAND() LIMIT 1', function(err, results, query) {
    if (err){
      console.log(err);
      return res.status(500).json({"Error": "Unexpected error occured. Please try again in a while"});
    }
    
    if(results.length > 0) {
      return res.status(200).json(results);
    } else{
      return res.status(200).json({"Error": "No records found."});
    }
  });
});


module.exports = router;
