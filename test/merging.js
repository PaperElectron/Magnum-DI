/**
 * @file merging
 * @author Jim Bulkowski <jim.b@paperelectron.com>
 * @project magnum-di
 * @license MIT {@link http://opensource.org/licenses/MIT}
 */

var tap = require('tap')

var injector = require('../index')();

tap.test('Merging existing objects', function(t) {
  t.plan(8);
  (function() {
    var obj = {}
    injector.service('merge', obj);
    var merge = injector.get('merge');
    t.type(merge, Object);
    t.equal(merge, obj);
  })();

  (function() {
    var toMerge = {name: 'merge'};
    injector.merge('merge', toMerge);
    var merge = injector.get('merge');
    t.ok(merge.name, 'Has name property.');
    t.equal(merge.name, 'merge', 'name property is correct');
  })();

  (function() {
    var toMerge = {location: 'Atlanta'};
    injector.merge('merge', toMerge);
    var merge = injector.get('merge');

    t.ok(merge.name, 'Still has name property.');
    t.ok(merge.location, 'Has location property.');
    t.equal(merge.name, 'merge', 'Has correct name');
    t.equal(merge.location, 'Atlanta', 'Has correct location');
  })();

})

tap.test('Merging a transient object', function(t) {
  t.plan(6);
  (function() {
    injector.merge('transient', {name: 'bob'})
    var transient = injector.get('transient');
    t.type(transient, Object)
    t.ok(transient.name, 'Has name property');
    t.equal(transient.name, 'bob', 'Name property correct');
  })();

  (function() {
    injector.merge('transient', {age: 26});
    var transient = injector.get('transient');
    t.type(transient,Object);
    t.equal(transient.name,'bob');
    t.equal(transient.age,26)
  })();

});
