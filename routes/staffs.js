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

// 获得管理员信息
router.get('/', function (req, res, next) {
    var whereStr = {};

    if (req.query.username != null) {
        whereStr.username = req.query.username;
    }
    if (req.query.name != null) {
        whereStr.name = req.query.name;
    }
    if (req.query.sex != null) {
        whereStr.sex = parseInt(req.query.sex);
    }
    if (req.query.birth != null) {
        whereStr.birth = new Date(req.query.birth);
    }
    if (req.query.phone != null) {
        whereStr.phone = req.query.phone;
    }
    if (req.query.other != null) {
        whereStr.other = req.query.other;
    }

    MongoClient.connect(DB_CONN_STR, function (err, db) {
        if (err) {
            console.log('Error:' + err);
            err['result'] = false;
            res.json(err);
        } else {
            mongoSql.selectData(db, 'staffs', whereStr, function (result) {
                db.close();
                res.json({
                    name: "Get staffs succeed",
                    result: true,
                    message: result
                });
            });
        }

    });
});

// 新增管理员
router.post('/', function (req, res, next) {
    var update = {
        username: req.body.username,
        password: req.body.password,
    };
    if (req.body.name != null) {
        update.name = req.body.name;
    }
    if (req.body.sex != null) {
        update.sex = parseInt(req.body.sex);
    }
    if (req.body.birth != null) {
        update.birth = new Date(req.body.birth);
    }
    if (req.body.phone != null) {
        update.phone = req.body.phone;
    }
    if (req.body.other != null) {
        update.other = req.body.other;
    }
    MongoClient.connect(DB_CONN_STR, function (err, db) {
        if (err) {
            console.log('Error:' + err);
            err['result'] = false;
            res.json(err);
        } else {
            mongoSql.selectData(db, 'staffs', {
                username: data.username
            }, function (result) {
                if (getJsonLength(result) == 1) {
                    db.close();
                    res.json({
                        name: "Post staff error",
                        result: false,
                        message: "Staff is exist"
                    });
                } else {
                    mongoSql.insertData(db, 'staffs', update, function (result) {
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
});

// 更新管理员信息
router.put('/', function (req, res, next) {
    var whereStr = {
        username: req.body.username
    };
    var update = {};
    if (req.body.password != null) {
        update.password = req.body.password;
    }
    if (req.body.name != null) {
        update.name = req.body.name;
    }
    if (req.body.sex != null) {
        update.sex = parseInt(req.body.sex);
    }
    if (req.body.birth != null) {
        update.birth = new Date(req.body.birth);
    }
    if (req.body.phone != null) {
        update.phone = req.body.phone;
    }
    if (req.body.other != null) {
        update.other = req.body.other;
    }
    MongoClient.connect(DB_CONN_STR, function (err, db) {
        if (err) {
            console.log('Error:' + err);
            err['result'] = false;
            res.json(err);
        } else {
            mongoSql.updateData(db, 'staffs', whereStr, update, function (result) {
                db.close();
                res.json({
                    name: "Put staffs succeed",
                    result: true,
                    message: result
                });
            });
        }

    });
});

router.delete('/', function (req, res, next) {
    var whereStr = {
        username: req.body.username
    };
    MongoClient.connect(DB_CONN_STR, function (err, db) {
        if (err) {
            console.log('Error:' + err);
            err['result'] = false;
            res.json(err);
        } else {
            mongoSql.delData(db, 'staffs', whereStr, function (result) {
                db.close();
                res.json({
                    name: "Delete staffs succeed",
                    result: true,
                    message: result
                });
            });
        }

    });
});

function getJsonLength(jsonData) {
    var jsonLength = 0;
    for (var item in jsonData) {
        jsonLength++;
    }
    return jsonLength;
};

module.exports = router;