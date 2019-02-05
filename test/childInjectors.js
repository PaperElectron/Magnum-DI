/**
 * @file childInjectors
 * @author Jim Bulkowski <jim.b@paperelectron.com>
 * @project magnum-di
 * @license MIT {@link http://opensource.org/licenses/MIT}
 */

'use strict';
let tap = require('tap');
let MagnumDI = require('../dist/MagnumDI').MagnumDI
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

tap.test('Retrieving parent and original injectors', (t) => {
  let father = new MagnumDI()
  father.service('level1', 1)
  t.equal(father.getKeys()[1], 'level1', 'Should get its own keys - level1')
  t.equal(father.getParent(), null, 'First ancestor has no parent')
  t.equal(father.getParent(true), null, 'First ancestor has no parent')

  let child = father.createChild()
  child.service('level2', 2)
  t.equal(child.getKeys()[1], 'level2', 'Should get its own keys - level2')
  t.equal(child.getParent().getKeys()[1], 'level1', 'Should get its first parent keys - level1')
  t.equal(child.getParent(true).getKeys()[1], 'level1', 'Should get its first parent keys - level1')

  let grandchild = child.createChild()
  grandchild.service('level3', 3)
  t.equal(grandchild.getKeys()[1], 'level3', 'Should get its own keys - level3')
  t.equal(grandchild.getParent().getKeys()[1], 'level2', 'Should get its first parent keys - level2')
  t.equal(grandchild.getParent(true).getKeys()[1], 'level1', 'Should get the original parent keys - level1')

  let greatgrandchild = grandchild.createChild()
  greatgrandchild.service('level4', 4)
  t.equal(greatgrandchild.getKeys()[1], 'level4', 'Should get its own keys - level4')
  t.equal(greatgrandchild.getParent().getKeys()[1], 'level3', 'Should get its first parent keys - level3')
  t.equal(greatgrandchild.getParent(true).getKeys()[1], 'level1', 'Should get the original parent keys - level1')

  t.done()
})