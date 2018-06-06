var staffsKeys = [];
var usersKeys = [];

var islogin = function (key, keys) {
    for (var i in keys) {
        if (keys[i].key == key) {
            return true;
        }
    };
    return false;
}

var getlogin = function (key, keys) {
    for (var i in keys) {
        if (keys[i].key == key) {
            return keys[i].username;
        }
    };
    return false;
}


module.exports.staffsKeys = staffsKeys;
module.exports.usersKeys = usersKeys;
module.exports.islogin = islogin;
module.exports.getlogin = getlogin;