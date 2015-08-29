/**
 * Created by per on 2015-08-29.
 */

const User = require("./user");

describe('User', function() {
    describe('#save()', function() {
        it('should save without error', function(done) {
            var user = new User('Luna');
            user.save(function(err) {
                if (err) throw err;
                done();
            });
        });
    });
});

