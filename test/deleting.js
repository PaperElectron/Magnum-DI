/**
 * @file deleting
 * @author Jim Bulkowski <jim.b@paperelectron.com>
 * @project magnum-di
 * @license MIT {@link http://opensource.org/licenses/MIT}
 */

'use strict';
var tap = require('tap');
let MagnumDI = require('../dist/MagnumDI').MagnumDI
let injector = new MagnumDI()

tap.test('Deleting dependencies', function(t){
  t.plan(5)
  injector.service('A', {a: 'A'});
  injector.service('B', {b: 'B'});

  t.equal(injector.get('A').a, 'A', 'Returns correct object');
  t.equal(injector.get('B').b, 'B', 'Returns correct object');

  injector.unregister('A');
  injector.unregister('B');

  t.equal(injector.get('A'), null, 'Returns null for removed deps');
  t.equal(injector.get('B'), null, 'Returns null for removed deps');

  injector.service('A', {a: 'A'});
  t.equal(injector.get('A').a, 'A', 'Reregister removed object');

})