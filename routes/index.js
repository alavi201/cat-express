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
  check('username', 'Must be a valid Email').isEmail(),
  check('password', 'Minimum length is 8 characters').isLength({ min: 8 }),
  check('name', 'Required, must contain only letters (a-zA-Z)').isAlpha(),
  check('weight', 'Must be a number').isNumeric(),
  check('breed', 'Must contain only letters (a-zA-Z').optional().isAlpha(),
  check('imageUrl', 'Must be a valid URL').optional().isURL(),
  check('birthdate', 'Must be a valid date in the format YYYY-MM-DD').optional().isISO8601().isLength({ min: 10, max: 10 })
], function(req, res, next) {

  const errors = validationResult(req);

  //respond with an error if validation fails
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

  var username = req.body.username;

  //check if username already exists
  db.query('SELECT id FROM cat WHERE username = ? ', [username], function(err, results, query) {
    if (err){
      console.log(error);
      return res.status(500).json({"Error": "Unexpected error occured. Please try again in a while"});
    }
    
    //assign fields
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
      
      //create record
      db.query('INSERT INTO cat SET ?', post, function(err, result) {
        if (err){
          console.log(err);
          return res.status(500).json({"Error": "Unexpected error occured. Please try again in a while"});
        }

        return res.sendStatus(201);
      });
    } else{
      return res.status(400).json({"Error": "Username already exists. Please choose a different username."});
    }
  });
});

router.post('/cat/login', function(req, res, next) {

  var username = req.body.username;
  var password = crypto.createHash('md5').update(req.body.password).digest("hex");

  //check if entry with username exists
  db.query('SELECT id, password from cat where username = ?', [username], function(err, results, query) {
    if (err){
      console.log(err);
      return res.status(500).json({"Error": "Unexpected error occured. Please try again in a while"});
    }
    
    if(results.length > 0) {
      //check if passwords match
      if(results[0].password == password){
        //update lastSeenAt
        db.query('UPDATE cat set lastSeenAt = NOW() where id = ?', [results[0].id]);
        // create a token
        var token = jwt.sign({ id: results[0].id }, config.secret, {
          expiresIn: 600 // expires in 10 minutes
        });
        return res.status(200).json({"authToken": token});
      } else{
        return res.status(400).json({"Error": "Incorrect password."});
      }
    } else{
      return res.status(400).json({"Error": "Username not found."});
    }
  });
});

router.get('/cats', function(req, res, next) {

  var authToken = req.header('authToken');
  
  if (!authToken){
    return res.status(400).json({"Error": "No token provided."});
  };

  //verify authToken
  jwt.verify(authToken, config.secret, function(err, decoded) {
    if (err){
      console.log(err);
      var message = "Failed to authenticate";
      if(err.name == "TokenExpiredError"){
        message = " This token has expired, please get a new token by logging in.";
      }
      return res.status(500).json({"Error": message});
    }

    var sql = 'SELECT id, username, name, birthdate, breed, imageUrl from cat ';
    //define allowed filters
    const existingParams = ["id", "name", "username"].filter(field => req.query[field]);

    //add filters to query
    if (existingParams.length) {
        sql += ' WHERE ';
        sql += existingParams.map(field => `${field} = ?`).join(' AND ');
    }

    sql += ' ORDER BY lastSeenAt';

    db.query(sql, existingParams.map(field => req.query[field]), function(err, results, query) {
      if (err){
        console.log(err);
        return res.status(500).json({"Error": "Unexpected error occured. Please try again in a while"});
      }
      
      if(results.length > 0) {
        return res.status(200).json(results);
      } else{
        return res.status(400).json({"Error": "Invalid search criteria"});
      }
    });
  });
});

router.get('/cats/random', function(req, res, next) {
  //get a random record
  db.query('SELECT imageUrl, name, breed FROM cat ORDER BY RAND() LIMIT 1', function(err, results, query) {
    if (err){
      console.log(err);
      return res.status(500).json({"Error": "Unexpected error occured. Please try again in a while"});
    }
    
    if(results.length > 0) {
      return res.status(200).json(results);
    } else{
      return res.status(400).json({"Error": "No records found."});
    }
  });
});


module.exports = router;
