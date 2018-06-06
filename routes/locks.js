var express = require('express');
var router = express.Router();

var staffsKeys = require("../module/loginKeys").staffsKeys;
var islogin = require("../module/loginKeys").islogin;

var MongoClient = require('mongodb').MongoClient;
var DB_CONN_STR = 'mongodb://localhost:27017/hotel'
var mongoSql = require("../module/mongoSql").mongoSql;

// 用户合法性验证
router.use('/', function (req, res, next) {
    if (islogin(req.get('key'), staffsKeys)) {
        next();
    } else {
        res.json({
            name: "API users failed",
            result: false,
            message: "User authentication failed"
        })
    }
});

// 获得用户信息
router.get('/', function (req, res, next) {

    MongoClient.connect(DB_CONN_STR, function (err, db) {
        if (err) {
            console.log('Error:' + err);
            err['result'] = false;
            res.json(err);
        } else {
            mongoSql.selectData(db, 'locks', {}, function (result) {
                db.close();
                res.json({
                    name: "Get locks succeed",
                    result: true,
                    message: result
                });
            });
        }

    });
});

module.exports = router;