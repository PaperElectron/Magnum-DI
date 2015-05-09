/**
 * @file UserRoutes
 * @author Jim Bulkowski <jim.b@paperelectron.com>
 * @project magnum-di
 * @license MIT {@link http://opensource.org/licenses/MIT}
 */

/**
 *
 * @module UserRoutes
 */

module.exports = function(Router, User) {

  //Router and User here will be injected.
  Router.get('/', function(req, res, next){
    User.userDetails('Bob', function(err, data){
      res.json({user: data})
    })
  });
  return {path: '/user', router: Router}
};