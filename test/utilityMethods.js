/**
 * @file utilityMethods
 * @author Jim Bulkowski <jim.b@paperelectron.com>
 * @project magnum-di
 * @license MIT {@link http://opensource.org/licenses/MIT}
 */

'use strict';
const tap = require('tap');
const _fp = require('lodash/fp')
const MagnumDI = require('../dist/MagnumDI').MagnumDI
const injector = new MagnumDI()

injector.service('Bob', {name: 'Bob'})
injector.service('Service', {name: 'Service'})
injector.factory('Factory', ()=>{})

tap.test('Returns and array of keynames',(t) => {
  let keys = injector.getKeys()
  t.equal(keys.length, 4, 'Has the correct number of keys')
  let diff = _fp.difference(['Injector', 'Bob', 'Service', 'Factory'], keys)
  t.equal(diff.length, 0 ,'Has only the expected keys.')

  t.done()
})