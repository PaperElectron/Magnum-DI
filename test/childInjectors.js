/**
 * @file childInjectors
 * @author Jim Bulkowski <jim.b@paperelectron.com>
 * @project magnum-di
 * @license MIT {@link http://opensource.org/licenses/MIT}
 */

'use strict';
let tap = require('tap');
let MagnumDI = require('../dist/MagnumDI')
let injector = new MagnumDI()

tap.test('Creating Child injectors', function(t){
  injector.service('bob', {name: 'Bob'})
  injector.service('Config', {name: 'Parent'})
  let bob = injector.inject('bob')
  t.equal(bob.name, 'Bob', 'Parent injector returns the correct bob')

  let child = injector.createChild()
  child.service('bob', {name: 'Bob Jr.'})
  let bobjr = child.inject('bob')
  t.equal(bobjr.name, 'Bob Jr.', 'Child injector returns the correct bob')

  let grandChild = child.createChild()
  grandChild.service('bob', {name: 'Bob III'})
  let bob3 = grandChild.inject('bob')
  t.equal(bob3.name, 'Bob III', 'Grandchild injector returns the correct bob')

  let config = grandChild.inject(function(Config){
    t.equal(Config.name, 'Parent', 'Child injectors will recurse up their own tree to find values.')
    t.ok(Config, 'Child Injectors work on functions')
  })

  t.done()
})