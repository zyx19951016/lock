var muilter = require('../module/multerUtil');

var fs = require('fs');
var path = require('path');

var staffsKeys = require("../module/loginKeys").staffsKeys;
var getlogin = require("../module/loginKeys").getlogin;

var staffname;

//multer有single()中的名称必须是表单上传字段的name名称。
var upload = muilter.single('avatar_file');
var fs = require('fs');

exports.dataInput = function (req, res) {
    staffname = getlogin(req.get('key'), staffsKeys);
    if (!staffname) {
        res.json({
            name: "API users failed",
            result: false,
            message: "User authentication failed"
        })
    } else {
        upload(req, res, function (err) {
            var pathName = path.dirname(__dirname);
            fs.exists(pathName + '/public/img/staffs/' + staffname + '.jpg', function (exists) {
                if (exists) {
                    fs.unlinkSync(pathName + '/public/img/staffs/' + staffname + '.jpg');
                }
                fs.rename(pathName + '/public/img/multer/' + req.file.filename, pathName + '/public/img/staffs/' + staffname + '.jpg', function (err) {
                    if (err) {
                        throw err;
                    }
                })
            })

            //添加错误处理
            if (err) {
                return console.log('err', err);
            }
            //文件信息在req.file或者req.files中显示。
            res.json({
                name: "Staff image succeed",
                result: false,
                message: "图片上传成功"
            })
        });
    }
}