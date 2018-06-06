var express = require('express');
var router = express.Router();

var MongoClient = require('mongodb').MongoClient;
var DB_CONN_STR = 'mongodb://localhost:27017/hotel'
var mongoSql = require("../module/mongoSql").mongoSql;

var username;
// 新增用户信息
router.post('/', function (req, res, next) {

    var data = {
        username: req.body.username,
        password: req.body.password,
        realname: '',
        idnum: '',
        sex: 0,
        birth: '',
        phone: '',
        other:''
    };
    if (req.body.realname != null) {
        data.realname = req.body.realname;
    }
    if (req.body.idnum != null) {
        data.idnum = req.body.idnum;
    }
    if (req.body.sex != null) {
        data.sex = parseInt(req.body.sex);
    }
    if (req.body.birth != null) {
        data.birth = new Date(req.body.birth);
    }
    if (req.body.phone != null) {
        data.phone = req.body.phone;
    }

    if (!isRightUser(data)) {
        res.json({
            name: "Post user error",
            result: false,
            message: "Userdata is not right"
        });
    } else {
        MongoClient.connect(DB_CONN_STR, function (err, db) {
            if (err) {
                console.log('Error:' + err);
                err['result'] = false;
                res.json(err);
            } else {
                mongoSql.selectData(db, 'users', {
                    username: data.username
                }, function (result) {
                    if (getJsonLength(result) == 1) {
                        db.close();
                        res.json({
                            name: "Post user error",
                            result: false,
                            message: "User is exist"
                        });
                    } else {
                        mongoSql.insertData(db, 'users', data, function (result) {
                            db.close();
                            res.json({
                                name: "Post users succeed",
                                result: true,
                                message: result
                            });
                        });
                    }
                });
            }

        });
    }
});

function isRightUser(data) {
    if (data.username.length > 5 && data.username.length < 20) {
        if (data.password.length > 5 && data.password.length < 20) {
            return true;
        }
    }
    return false;
};

function getJsonLength(jsonData) {
    var jsonLength = 0;
    for (var item in jsonData) {
        jsonLength++;
    }
    return jsonLength;
};

module.exports = router;