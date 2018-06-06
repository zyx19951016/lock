var express = require('express');
var router = express.Router();

var staffsKeys = require("../module/loginKeys").staffsKeys;
var islogin = require("../module/loginKeys").islogin;

var MongoClient = require('mongodb').MongoClient;
var DB_CONN_STR = 'mongodb://localhost:27017/hotel'
var mongoSql = require("../module/mongoSql").mongoSql;

// 管理员合法性验证
router.use('/', function (req, res, next) {
    if (islogin(req.get('key'), staffsKeys)) {
        next();
    } else {
        res.json({
            name: "API staffs failed",
            result: false,
            message: "User authentication failed"
        })
    }
});

// 获得日志信息
router.get('/', function (req, res, next) {
    var whereStr = {};
    if (req.query.date != null) {
        whereStr.date = {
            $gte: new Date(req.query.date)
        }
    }
    MongoClient.connect(DB_CONN_STR, function (err, db) {
        if (err) {
            console.log('Error:' + err);
            err['result'] = false;
            res.json(err);
        } else {
            var collection = db.collection('logs');
            //查询数据
            if (req.query.limit != null) {
                collection.find(whereStr).sort({
                    _id: -1
                }).limit(parseInt(req.query.limit)).toArray(function (err, result) {
                    if (err) {
                        console.log('Error:' + err);
                        err['result'] = false;
                        res.json(err);
                    } else {
                        db.close();
                        res.json({
                            name: "Get logs succeed",
                            result: true,
                            message: result
                        });
                    }
                });
            } else {
                collection.find(whereStr).sort({
                    _id: -1
                }).toArray(function (err, result) {
                    if (err) {
                        console.log('Error:' + err);
                        err['result'] = false;
                        res.json(err);
                    } else {
                        db.close();
                        res.json({
                            name: "Get logs succeed",
                            result: true,
                            message: result
                        });
                    }
                });
            }

        }
    });
});

module.exports = router;