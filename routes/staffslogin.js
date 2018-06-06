var express = require('express');
var router = express.Router();

var staffsKeys = require("../module/loginKeys").staffsKeys;

var MongoClient = require('mongodb').MongoClient;
var DB_CONN_STR = 'mongodb://localhost:27017/hotel'
var mongoSql = require("../module/mongoSql").mongoSql;


// 管理员登录
router.post('/', function (req, res, next) {
    
    var username = req.body.username;
    var password = req.body.password;
    var whereStr = {
        username: username,
        password: password
    }

    MongoClient.connect(DB_CONN_STR, function (err, db) {
        if (err) {
            console.log('Error:' + err);
            err['result'] = false;
            return res.json(err);
        } else {
            mongoSql.selectData(db, 'staffs', whereStr, function (result) {
                db.close();
                if (getJsonLength(result) == 1) {
                    var isexist = false;
                    for (var item in staffsKeys) {
                        if (staffsKeys[item].username == username) {
                            var key = randomWord();
                            staffsKeys[item].key = key;
                            isexist = true;
                            break;
                        }
                    }
                    if (!isexist) {
                        var key = randomWord();
                        staffsKeys.push({
                            username: username,
                            key: key
                        });
                    }
                    res.json({
                        name: "Login succeed",
                        result: true,
                        message: key
                    });
                } else {
                    res.json({
                        name: "Login falied",
                        result: false,
                        message: "Username or password falied"
                    });
                }
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

function randomWord() {
    var str = "",
        range = 32,
        arr = ['0', '1', '2', '3', '4', '5', '6', '7', '8', '9', 'a', 'b', 'c', 'd', 'e', 'f', 'g', 'h', 'i', 'j', 'k', 'l', 'm', 'n', 'o', 'p', 'q', 'r', 's', 't', 'u', 'v', 'w', 'x', 'y', 'z', 'A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'I', 'J', 'K', 'L', 'M', 'N', 'O', 'P', 'Q', 'R', 'S', 'T', 'U', 'V', 'W', 'X', 'Y', 'Z'];
    // 随机产生
    for (var i = 0; i < range; i++) {
        pos = Math.round(Math.random() * (arr.length - 1));
        str += arr[pos];
    }
    return str;
};

module.exports = router;