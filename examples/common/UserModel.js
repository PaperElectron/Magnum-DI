/**
 * @file UserModel
 * @author Jim Bulkowski <jim.b@paperelectron.com>
 * @project magnum-di
 * @license MIT {@link http://opensource.org/licenses/MIT}
 */

/**
 *
 * @module UserModel
 */

//Our Database object here is provided by the injector.
module.exports = function(Database){
  return {
    userDetails: function(username, cb){
      Database.User.find(username, function(err, data){
        cb(null, data)
      })
    }
  }
};