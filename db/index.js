var mysql = require('mysql');
var config = require('../config.json');
var db;

function connectDatabase() {
    if (!db) {
        db = mysql.createConnection(config);

        db.connect(function(err){
            if(!err) {
                console.log('Database is connected!');
            } else {
                console.log(err);
                console.log('Unable to connect to database');
            }
        });
    }
    return db;
}

module.exports = connectDatabase();