/**
 * @file multipleInstances
 * @author Jim Bulkowski <jim.b@paperelectron.com>
 * @project magnum-di
 * @license MIT {@link http://opensource.org/licenses/MIT}
 */

'use strict';
var tap = require('tap');

var Injector = require('../index');

var Inj1 = Injector();
var Inj2 = new Injector()

tap.test('Multiple Injector Instances', function(t){
  t.plan(2)
  var sharedObj = {name: 'bob'};
  Inj1.service('bob', sharedObj);
  Inj2.service('bob', sharedObj);
  var bob1 = Inj1.get('bob');
  var bob2 = Inj2.get('bob');
  t.same(bob1, bob2, 'Both Objects should be equal.');
  t.same(bob1, sharedObj, 'Should equal original object');
});

tap.test('Objects should be distinct', function(t){
  t.plan(1)
  Inj1.service('tom', {name: 'Tom'});
  Inj2.service('tom', {name: 'Tommy'});
  var tom1 = Inj1.get('tom');
  var tom2 = Inj2.get('tom');
  t.notSame(tom1, tom2, 'Objects should nt be equal.')
});