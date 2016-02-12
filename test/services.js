/**
 * @file services
 * @author Jim Bulkowski <jim.b@paperelectron.com>
 * @project magnum-di
 * @license MIT {@link http://opensource.org/licenses/MIT}
 */

'use strict';
var tap = require('tap')

var injector = require('../index')();
tap.test('Adds services.', function(t) {
  t.plan(14)
  injector.service('Service', {name: 'Service', special: Math.random()})
  injector.service('Constructor', function() {
    return {name: 'Constructor'}
  })

  t.doesNotThrow(function() {
    injector.service('noThrow', {})
  }, 'Valid name does not throw.')

  t.throws(function() {
    injector.service('noThrow', {})
  }, 'Duplicate name throws.')

  t.throws(function() {
    injector.service('This is bad', {})
  }, 'Identifier with spaces throws')

  t.throws(function() {
    injector.service('This-also-bad', {})
  }, 'Identifier with hyphens throws')

  t.doesNotThrow(function() {
    injector.service('validname', {})
  }, 'Valid name does not throw.')

  t.throws(function() {
    injector.service()
  }, 'Adding service throws with no args.');

  t.throws(function() {
    injector.service({})
  }, 'Adding service throws with no name and wrong type.');

  t.throws(function() {
    injector.service(function() {
    })
  }, 'Adding service throws with no name.');

  t.throws(function() {
    injector.service('Test')
  }, 'Adding service throws with no dependency');

  t.throws(function() {
    injector.service(10, {})
  }, 'Adding service throws with invalid name.');

  var A = injector.get('Service');
  var B = injector.get('Service');
  var C = injector.get('Constructor')();
  t.equal(A.name, "Service", 'Service returns the correct object');
  t.equal(B.name, "Service", 'Service returns the correct object');
  t.equal(C.name, "Constructor", 'Service retuns a function unaltered');
  t.equal(A.special,B.special, 'Service always returns the same object');

});