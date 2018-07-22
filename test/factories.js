/**
 * @file factories
 * @author Jim Bulkowski <jim.b@paperelectron.com>
 * @project magnum-di
 * @license MIT {@link http://opensource.org/licenses/MIT}
 */

'use strict';
var tap = require('tap')

let MagnumDI = require('../dist/MagnumDI')
let injector = new MagnumDI()

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

tap.test('Creating factories that accept injected arguments', function(t){
  t.plan(2)
  injector.service('ForFactory', {factoryArg: 'hello'})
  injector.factory('Parameterized', function(ForFactory){
    return ForFactory
  })
  t.equal(injector.get('Parameterized').factoryArg, 'hello', 'Factory injects available arguments.')

  injector.inject(function(Parameterized){
    t.equal(Parameterized.factoryArg, 'hello', 'Factory functions passed through injector, called with injected args.')
  })

});

tap.test('Getting factory directly via string arg to injector.inject', function(t) {
  t.plan(1)
  injector.factory('GetFactory', function(){
    return {name: 'GetFactory'}
  })
  var direct = injector.inject('GetFactory')
  t.equal(direct.name, 'GetFactory', 'When passed a string inject executes factory functions')
});