var express = require('express');
var router = express.Router();

var staffsKeys = require("../module/loginKeys").staffsKeys;
var islogin = require("../module/loginKeys").islogin;

var MongoClient = require('mongodb').MongoClient;
var ObjectID = require('mongodb').ObjectID;

var DB_CONN_STR = 'mongodb://localhost:27017/hotel'
var mongoSql = require("../module/mongoSql").mongoSql;

router.post('/', function (req, res, next) {
    var whereStr = {
        _id: ObjectID(req.body.roomname)
    };


    MongoClient.connect(DB_CONN_STR, function (err, db) {
        if (err) {
            console.log('Error:' + err);
            err['result'] = false;
            return res.json(err);
        } else {
            mongoSql.selectData(db, 'rooms', whereStr, function (result) {
                console.log("result"+result._id);
                if (result != null) {
                    res.json({
                        name: "Get rooms succeed",
                        result: true,
                        message:  "https://cli.im/api/qrcode/code?text="+result._id+"mhid=5EvDBQzuy5ghMHcqL9NXMaw"
                    });
                } else {
                    res.json({
                        name: "Get rooms failed",
                        result: false,
                        message: "设备号不存在"
                    });
                }
            });
        }
    });
})


module.exports = router;