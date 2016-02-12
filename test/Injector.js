/**
 * @file injection
 * @author Jim Bulkowski <jim.b@paperelectron.com>
 * @project magnum-di
 * @license MIT {@link http://opensource.org/licenses/MIT}
 */

'use strict';
var tap = require('tap');

var injector = require('../index')();

injector.service('Service', {name: 'Service'});

injector.factory('Factory', function() {
  return {name: 'Factory'}
});

injector.instance('Instance', function() {
  this.name = 'Instance'
});

injector.merge('Merge', {name: 'Merge'});
injector.merge('Merge', {a: 'A'});
injector.merge('Merge', {b: 'B'});

tap.test('Injecting Dependencies', function(t) {
  t.plan(7);
  injector.inject(function(Service, Factory, Instance, Merge) {
    t.equal(Service.name, 'Service', 'Service Object has correct data.');
    t.equal(Factory.name, 'Factory', 'Factory Object has correct data.');
    t.equal(Instance.name, 'Instance', 'Instance Object has correct data.');
    t.equal(Merge.name, 'Merge', 'Merge Object has correct data.');
    t.equal(Merge.b, 'B', 'Merge Object merged objects.')
  });

  injector.inject(function(Foo) {
    t.equal(Foo, null, 'Missing dependency should equal null')
  });

  injector.inject(function() {
    t.equal(this.name, 'thisArg', 'Injected function should execute with the correct context.')
  }, {name: 'thisArg'})
});

