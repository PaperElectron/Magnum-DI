/**
 * @file instances
 * @author Jim Bulkowski <jim.b@paperelectron.com>
 * @project magnum-di
 * @license MIT {@link http://opensource.org/licenses/MIT}
 */

'use strict';
var tap = require('tap')

var injector = require('../index')();

tap.test('Instance constructors.', function(t) {
  t.plan(7)
  injector.instance('Instance', function() {
    this.name = 'Instance';
    this.setup = function(name) {
      this.name = name;
      return this
    };
    this.get = function() {
      return this.name
    }
  })

  t.throws(function() {
    injector.instance()
  }, 'Throws with missing name and dependency');

  t.throws(function() {
    injector.instance({})
  }, 'Throws with missing name');

  t.throws(function() {
    injector.instance('Test')
  }, 'Throws with missing dependency');

  t.throws(function() {
    injector.instance('Test', {})
  }, 'Throws with wront dependency type');

  var A = injector.get('Instance').setup('bob');
  var B = injector.get('Instance').setup('tom');
  t.equal(A.get(),'bob');
  t.equal(B.get(),'tom');
  t.equal(A.constructor, B.constructor)
});