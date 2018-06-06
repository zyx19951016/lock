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
    var whereStr = {
        username: username
    };
    MongoClient.connect(DB_CONN_STR, function (err, db) {
        if (err) {
            console.log('Error:' + err);
            err['result'] = false;
            res.json(err);
        } else {
            mongoSql.selectData(db, 'users', whereStr, function (result) {
                db.close();
                res.json({
                    name: "Get users succeed",
                    result: true,
                    message: result
                });
            });
        }

    });
});

// 更新用户信息
router.put('/', function (req, res, next) {
    var whereStr = {
        username: req.body.username
    };
    var update = {};
    if (req.body.password != null) {
        update.password = req.body.password;
    }
    if (req.body.realname != null) {
        update.realname = req.body.realname;
    }
    if (req.body.sex != null) {
        update.sex = parseInt(req.body.sex);
    }
    if (req.body.birth != null) {
        update.birth = new Date(req.body.birth);
    }
    if (req.body.idnum != null) {
        update.idnum = req.body.idnum;
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
            return res.json(err);
        } else {
            mongoSql.updateData(db, 'users', whereStr, update, function (result) {
                db.close();
                res.json({
                    name: "Put users succeed",
                    result: true,
                    message: result
                });
            });
        }
    });
});

//添加用户信息
router.post('/', function (req, res, next) {
    var whereStr = {
        username: req.body.username
    };
    var update = {};
    if (req.body.password != null) {
        update.password = req.body.password;
    }
    if (req.body.realname != null) {
        update.realname = req.body.realname;
    }
    if (req.body.sex != null) {
        update.sex = parseInt(req.body.sex);
    }
    if (req.body.birth != null) {
        update.birth = new Date(req.body.birth);
    }
    if (req.body.idnum != null) {
        update.idnum = req.body.idnum;
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
					mongoSql.insertData(db, 'users', update, function (result) {
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

router.delete('/', function (req, res, next) {

});

function getJsonLength(jsonData) {
    var jsonLength = 0;
    for (var item in jsonData) {
        jsonLength++;
    }
    return jsonLength;
};

module.exports = router;