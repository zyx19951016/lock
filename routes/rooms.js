var express = require('express');
var router = express.Router();

var staffsKeys = require("../module/loginKeys").staffsKeys;
var islogin = require("../module/loginKeys").islogin;

var MongoClient = require('mongodb').MongoClient;
var ObjectID = require('mongodb').ObjectID;

var DB_CONN_STR = 'mongodb://localhost:27017/hotel'
var mongoSql = require("../module/mongoSql").mongoSql;

router.use('/', function (req, res, next) {
    if (islogin(req.get('key'), staffsKeys)) {
        next();
    } else {
        res.json({
            name: "API rooms failed",
            result: false,
            message: "User authentication failed"
        })
    }
});

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

router.post('/', function (req, res, next) {
    var data = {
        imageurl: {
            pic1: "room1.png",
            pic2: "room2.png",
            pic3: "room3.png"
        }
    };
    if (req.body.hotelname != null) {
        data.hotelname = req.body.hotelname;
    }
    if (req.body.number != null) {
        data.number = req.body.number;
    }
    if (req.body.state != null) {
        data.state = parseInt(req.body.state);
    }
    if (req.body.type != null) {
        data.type = parseInt(req.body.type);
    }
    if (req.body.price != null) {
        data.price = req.body.price;
    }
    if (req.body.address != null) {
        data.address = req.body.address;
    }

    MongoClient.connect(DB_CONN_STR, function (err, db) {
        if (err) {
            console.log('Error:' + err);
            err['result'] = false;
            res.json(err);
        } else {
            mongoSql.insertData(db, 'rooms', data, function (result) {
                db.close();
                res.json({
                    name: "Post rooms succeed",
                    result: true,
                    message: result
                });
            });
        }
    });
});

router.put('/', function (req, res, next) {
    var whereStr = {
        _id: ObjectID(req.body.id)
    };
    var update = {};
    if (req.body.hotelname != null) {
        update.hotelname = req.body.hotelname;
    }
    if (req.body.number != null) {
        update.number = req.body.number;
    }
    if (req.body.state != null) {
        update.state = parseInt(req.body.state);
    }
    if (req.body.type != null) {
        update.type = parseInt(req.body.type);
    }
    if (req.body.price != null) {
        update.price = req.body.price;
    }
    if (req.body.address != null) {
        update.address = req.body.address;
    }
    MongoClient.connect(DB_CONN_STR, function (err, db) {
        if (err) {
            console.log('Error:' + err);
            err['result'] = false;
            res.json(err);
        } else {
            mongoSql.updateData(db, 'rooms', whereStr, update, function (result) {
                db.close();
                res.json({
                    name: "Put rooms succeed",
                    result: true,
                    message: result
                });
            });
        }

    });
});

router.delete('/', function (req, res, next) {
    var whereStr = {
        _id: ObjectID(req.body.id)
    };
    MongoClient.connect(DB_CONN_STR, function (err, db) {
        if (err) {
            console.log('Error:' + err);
            err['result'] = false;
            res.json(err);
        } else {
            mongoSql.delData(db, 'rooms', whereStr, function (result) {
                db.close();
                res.json({
                    name: "Delete rooms succeed",
                    result: true,
                    message: result
                });
            });
        }

    });
});

module.exports = router;