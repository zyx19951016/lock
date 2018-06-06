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

/* GET orders listing. */
router.get('/', function (req, res, next) {
    var whereStr = {};
    if (req.query.user != null) {
        whereStr.user = req.query.user;
    }
    if (req.query.room != null) {
        whereStr.room = req.query.room;
    }
    if (req.query.state != null) {
        whereStr.state = parseInt(req.query.state);
    }
    if (req.query.ordertime != null) {
        whereStr.ordertime = new Date(req.query.ordertime);
    }
    if (req.query.intime != null) {
        whereStr.intime = new Date(req.query.intime);
    }
    if (req.query.outtime != null) {
        whereStr.outtime = new Date(req.query.outtime);
    }
    if (req.query.cost != null) {
        whereStr.cost = req.query.cost;
    }

    MongoClient.connect(DB_CONN_STR, function (err, db) {
        if (err) {
            console.log('Error:' + err);
            err['result'] = false;
            res.json(err);
        } else {
            mongoSql.selectData(db, 'orders', whereStr, function (result) {
                db.close();
                res.json({
                    name: "Get orders succeed",
                    result: true,
                    message: result
                });
            });
        }
    });
});

router.post('/', function (req, res, next) {
    var whereStr = {
        _id: ObjectID(req.body.room)
    }
    var data = {};
    if (req.body.user != null) {
        data.user = req.body.user;
    }
    if (req.body.room != null) {
        data.room = req.body.room;
    }
    if (req.body.state != null) {
        data.state = parseInt(req.body.state);
    }
    if (req.body.ordertime != null) {
        data.ordertime = new Date(req.body.ordertime);
    }
    if (req.body.intime != null) {
        data.intime = new Date(req.body.intime);
    }
    if (req.body.outtime != null) {
        data.outtime = new Date(req.body.outtime);
    }
    if (req.body.people != null) {
        data.people = req.body.people;
    }
    if (req.body.cost != null) {
        data.cost = req.body.cost;
    }

    MongoClient.connect(DB_CONN_STR, function (err, db) {
        if (err) {
            console.log('Error:' + err);
            err['result'] = false;
            res.json(err);
        } else {
            mongoSql.selectData(db, 'rooms', whereStr, function (result) {
                if (result[0].state == 0) {
                    mongoSql.updateData(db, 'rooms', whereStr, {
                        state: 1
                    }, function (result) {
                        mongoSql.insertData(db, 'orders', data, function (result) {
                            db.close();
                            res.json({
                                name: "Post order succeed",
                                result: true,
                                message: result
                            });
                        });
                    });
                } else {
                    db.close();
                    res.json({
                        name: "Post order failed",
                        result: false,
                        message: "The room is used"
                    });
                }
            });
        }
    });
});

router.put('/', function (req, res, next) {
    var whereStr = {
        _id: ObjectID(req.body.id)
    };
    var update = {};
    if (req.body.user != null) {
        update.user = req.body.user;
    }
    if (req.body.room != null) {
        update.room = req.body.room;
    }
    if (req.body.state != null) {
        update.state = parseInt(req.body.state);
    }
    if (req.body.ordertime != null) {
        update.ordertime = new Date(req.body.ordertime);
    }
    if (req.body.intime != null) {
        update.intime = new Date(req.body.intime);
    }
    if (req.body.outtime != null) {
        update.outtime = new Date(req.body.outtime);
    }
    if (req.body.cost != null) {
        update.cost = req.body.cost;
    }

    MongoClient.connect(DB_CONN_STR, function (err, db) {
        if (err) {
            console.log('Error:' + err);
            err['result'] = false;
            res.json(err);
        } else {
            mongoSql.updateData(db, 'orders', whereStr, update, function (result) {
                if (update.state == 0 || update.state == 1) {
                    var state = {
                        state: 1
                    }
                } else {
                    var state = {
                        state: 0
                    }
                }
                mongoSql.updateData(db, 'rooms', {
                    _id: ObjectID(update.room)
                }, state, function (result) {
                    db.close();
                    res.json({
                        name: "Put orders succeed",
                        result: true,
                        message: result
                    });
                });
            });
        }

    });
});

module.exports = router;