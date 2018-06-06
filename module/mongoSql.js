var mongoSql = {
    selectData: function () {},
    insertData: function () {},
    updateData: function () {},
    delData: function () {},
    ordersState: function () {}
};
mongoSql.selectData = function (db, col, whereStr, callback) {
    //连接到表
    var collection = db.collection(col);
    //查询数据
    collection.find(whereStr).toArray(function (err, result) {
        if (err) {
            console.log('Error:' + err);
            return;
        }
        callback(result);
    });
};
mongoSql.insertData = function (db, col, data, callback) {
    //连接到表  
    var collection = db.collection(col);
    //添加数据
    collection.insert(data, function (err, result) {
        if (err) {
            console.log('Error:' + err);
            return;
        }
        callback(result);
    });
};
mongoSql.updateData = function (db, col, whereStr, update, callback) {
    //连接到表  
    var collection = db.collection(col);
    //更新数据
    var updateStr = {
        $set: update
    };
    collection.update(whereStr, updateStr, function (err, result) {
        if (err) {
            console.log('Error:' + err);
            return;
        }
        callback(result);
    });
};
mongoSql.delData = function (db, col, whereStr, callback) {
    //连接到表
    var collection = db.collection(col);
    //查询数据
    collection.remove(whereStr, function (err, result) {
        if (err) {
            console.log('Error:' + err);
            return;
        }
        callback(result);
    });
};

mongoSql.ordersState = function (db, callback) {
    //连接到表
    var collection = db.collection('orders');
    //查询数据
    collection.findAndModify({
            intime: {
                $lte: new Date()
            }
        }, [
            ['inttime', 1]
        ], {
            $set: {
                state: 1
            }
        }, {
            new: true
        },
        function (err, result) {
            if (err) {
                console.log('Error:' + err);
                return;
            }
            callback(result);
        });
    db.close();
};

module.exports.mongoSql = mongoSql;