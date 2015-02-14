var main = require("./main");

exports["test main"] = function(assert) {
  assert.pass("Unit test running!");
};

exports["test main async"] = function(assert, done) {
  assert.pass("async Unit test running!");
  done();
};

// exports["test init"] = function(assert) {
    // assert.ok(typeof main.init() === "undefined", "init works");
// };


require("sdk/test").run(exports);
