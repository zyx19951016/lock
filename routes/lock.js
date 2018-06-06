var express = require('express');
var router = express.Router();

var usersKeys = require("../module/loginKeys").usersKeys;
var islogin = require("../module/loginKeys").islogin;
var getlogin = require("../module/loginKeys").getlogin;

var MongoClient = require('mongodb').MongoClient;
var DB_CONN_STR = 'mongodb://localhost:27017/hotel'
var mongoSql = require("../module/mongoSql").mongoSql;

var username;

// 用户合法性验证
router.use('/', function (req, res, next) {
    username = getlogin(req.get('key'), usersKeys);
    if (!username) {
        res.json({
            name: "API users failed",
            result: false,
            message: "User authentication failed"
        })
    } else {
        next();
    }
});

// 获得用户信息
router.get('/', function (req, res, next) {

    if (req.query.room == null) {
        res.json({
            name: "Get lock failed",
            result: false,
            message: 'no room'
        });
    } 
    else {
        var password = randomWord();
        var data = {
            user: username,
            room: req.query.room,
            password: password,
            date: new Date()
        }

        MongoClient.connect(DB_CONN_STR, function (err, db) {
            if (err) {
                console.log('Error:' + err);
                err['result'] = false;
                res.json(err);
            } else {
                mongoSql.insertData(db, 'locks', data, function (result) {
                    db.close();
                    res.json({
                        name: "Get lock succeed",
                        result: true,
                        message: password
                    });
                });
            }
        });
        

    }

});

function randomWord() {
    var str = "",
        range = 6,
        arr = ['0', '1', '2', '3', '4', '5', '6', '7', '8', '9'];
    // 随机产生
    for (var i = 0; i < range; i++) {
        pos = Math.round(Math.random() * (arr.length - 1));
        str += arr[pos];
    }
    return str;
};

module.exports = router;