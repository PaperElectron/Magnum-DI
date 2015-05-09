/**
 * @file UserModel_test
 * @author Jim Bulkowski <jim.b@paperelectron.com>
 * @project magnum-di
 * @license MIT {@link http://opensource.org/licenses/MIT}
 */

var injector = require('../../index');
var should = require('should');

//Our mock database object
injector.service('Database', {
  User: {
    users: {George: {name: 'George', age: 30}, Mike: {name: 'Mike', age: 20}},
    find: function(username, cb) {
      var user = (this.users[username]) ? this.users[username] : null
      cb(null, user);
    }
  }
});

//We now have a user model that is using our mock database.
var User = injector.inject(require('../common/UserModel'));

describe('Model being tested with a mock Database object', function() {

  it('should not have real data', function(done) {
    User.userDetails('Bob', function(err, data){
      should(data).be.null
      done()
    })
  });

  it('should have mock data', function(done) {
    User.userDetails('George', function(err, data){
      data.age.should.equal(30)
      done()
    })
  });

});