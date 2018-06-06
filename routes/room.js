var express = require('express');
var router = express.Router();

var usersKeys = require("../module/loginKeys").usersKeys;
var islogin = require("../module/loginKeys").islogin;
var getlogin = require("../module/loginKeys").getlogin;

var MongoClient = require('mongodb').MongoClient;
var DB_CONN_STR = 'mongodb://localhost:27017/hotel'
var mongoSql = require("../module/mongoSql").mongoSql;

/* GET rooms listing. */
router.get('/', function (req, res, next) {
    var whereStr = {};
    if (req.query.hotelname != null) {
        whereStr.hotelname = req.query.hotelname;
    }
    if (req.query.number != null) {
        whereStr.number = req.query.number;
    }
    if (req.query.state != null) {
        whereStr.state = parseInt(req.query.state);
    }
    if (req.query.type != null) {
        whereStr.type = parseInt(req.query.type);
    }
    if (req.query.price != null) {
        whereStr.price = req.query.price;
    }
    if (req.query.address != null) {
        whereStr.address = req.query.address;
    }
    MongoClient.connect(DB_CONN_STR, function (err, db) {
        if (err) {
            console.log('Error:' + err);
            err['result'] = false;
            res.json(err);
        } else {
            mongoSql.selectData(db, 'rooms', whereStr, function (result) {
                db.close();
                res.json({
                    name: "Get rooms succeed",
                    result: true,
                    message: result
                });
            });
        }
    });
});

module.exports = router;