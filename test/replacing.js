/**
 * @file modifying
 * @author Jim Bulkowski <jim.b@paperelectron.com>
 * @project magnum-di
 * @license MIT {@link http://opensource.org/licenses/MIT}
 */

'use strict';
const tap = require('tap');
const MagnumDI = require('../dist/MagnumDI')
const injector = new MagnumDI()

tap.test('Set an object.', function(t) {
  t.plan(3)
  injector.service('modify', {name: "modify"});
  var toModify = injector.get('modify');

  t.equal(toModify.name, 'modify', 'Correct name');

  toModify = injector.replace('modify', {name: 'modified', other: 'defined'});
  t.equal(toModify.name, 'modified', 'Replaced object has correct name');
  t.equal(toModify.other, 'defined', 'Replaced object has correct properties');
});

tap.test('Returning the correct object after modification', function(t) {
  t.plan(2)
  var modified = injector.get('modify');
  t.equal(modified.name, 'modified');
  t.equal(modified.other, 'defined');

});

tap.test('Rejecting improper parameters', function(t) {
  t.plan(3);
  injector.service('improper', {name: 'improper'});
  injector.factory('improperFactory', function() {
  });
  injector.instance('improperInstance', function() {
  });
  var improper = injector.get('improper');

  t.throws(function() {
    injector.replace('improper', function() {
    })
  }, 'Throws on bad argument type on replacement');

  t.throws(function() {
    injector.replace('improperFactory', {name: 'improperFactory'})
  }, 'Throws on attempt to assign an object to a factory on replacement')

  t.throws(function() {
    injector.replace('improperInstance', {name: 'improperInstance'})
  }, 'Throws on attempt to assign an object to an instance on replacement')
});

tap.test('Injecting functions before and after modification', function(t) {
  t.plan(3)
  var obj = {name: 'before'};
  injector.service('Before', obj);
  var injectFn = function(Before) {
    return Before
  };

  var firstRun = injector.inject(injectFn);
  t.equal(firstRun.name, 'before')

  injector.replace('Before', {name: 'after'});
  var modified = injector.get('Before');
  t.equal(modified.name, 'after');

  var secondRun = injector.inject(injectFn);
  t.equal(secondRun.name, 'after');

})
