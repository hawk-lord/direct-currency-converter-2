/**
 * Created by per on 2015-08-29.
 */

const User = function(name) {
    "use strict";
    var name = name;
};

User.prototype.save = function(func) {
    func();
};

module.exports = User;
