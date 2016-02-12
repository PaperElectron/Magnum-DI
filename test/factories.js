/**
 * @file factories
 * @author Jim Bulkowski <jim.b@paperelectron.com>
 * @project magnum-di
 * @license MIT {@link http://opensource.org/licenses/MIT}
 */

'use strict';
var tap = require('tap')

var injector = require('../index')();

tap.test('Factories.', function(t) {
  t.plan(7)
  injector.factory('Factory', function() {
    return {name: 'Factory', special: Math.random()}
  })

  t.throws(function() {
    injector.factory()
  }, 'Adding factory throws with no args.');

  t.throws(function() {
    injector.factory({})
  }, 'Adding factory throws with no name.');

  t.throws(function() {
    injector.factory('Test')
  }, 'Adding factory throws with no dependency');

  t.throws(function() {
    injector.factory('Test', {})
  }, 'Adding factory throws with wrong dependency type.')

  var A = injector.get('Factory');
  var B = injector.get('Factory');
  t.equal(A.name, 'Factory', 'Returns correct object');
  t.equal(B.name, 'Factory', 'Also returns the correct object');
  t.notEqual(A.special, B.special, 'Returned distinct objects')
});