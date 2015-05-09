/**
 * @file Database
 * @author Jim Bulkowski <jim.b@paperelectron.com>
 * @project magnum-di
 * @license MIT {@link http://opensource.org/licenses/MIT}
 */

/**
 * Fake database for Magnum-di examples
 * @module Database
 */

module.exports = {
  User: {
    users: {Bob: {name: 'Bob', age: 27}, Tom: {name: 'Tom', age: 38}},
    find: function(username, cb){
      var user = (this.users[username]) ? this.users[username] : null
      cb(null, user);
    }
  }
}
