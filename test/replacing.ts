/**
 * @file replacing
 * @author Jim Bulkowski <jim.b@paperelectron.com>
 * @project magnum-di
 * @license MIT {@link http://opensource.org/licenses/MIT}
 */

import {MagnumDI} from "../src/"

describe('Replacing injectable values', () => {
  const injector = new MagnumDI()

  test('Modifying a anything', () => {
    injector.anything('modify', {name: 'modify'})
    expect(injector.inject('modify')).toEqual(expect.objectContaining({name: 'modify'}))
    injector.replace('modify', {name: 'modified', other: 'defined'})
    expect(injector.inject('modify')).toEqual(expect.objectContaining({name: 'modified', other: 'defined'}))
  })

  test('Cannot replace anything objects with a function.', () => {
    injector.anything('improper', {name: 'improper'});
    expect(() => {
      //@ts-ignore
      injector.replace('improper', () => {

      })
    }).toThrowError(new Error('improper: Replacement value for MagnumDI.replace() cannot be a function'))
  })

  test('Cannot replace factory functions with an object.', () => {
    injector.factory('improperFactory', function () {
    });
    expect(() => {
      //@ts-ignore
      injector.replace('improperFactory', {name: 'bad'})
    }).toThrowError(new Error('improperFactory: MagnumDI.replace() cannot replace an injectable function'))
  })

  test('Cannot replace instance injectors with an object.', () => {
    injector.instance('improperInstance', class Improper{});
    expect(() => {
      //@ts-ignore
      injector.replace('improperInstance', {name: 'bad'})
    }).toThrowError(new Error('improperInstance: MagnumDI.replace() cannot replace an injectable function'))
  })

  test('Injecting functions before and after modification', () => {
    let before = {name: 'before'}
    let after = {name: 'after'}
    injector.anything('Before', before)
    injector.inject((Before) => {
      expect(Before).toEqual(expect.objectContaining(before))
    })
    injector.replace('Before', after)
    injector.inject((Before) => {
      expect(Before).toEqual(expect.objectContaining(after))
    })
  })
});


//
// tap.test('Injecting functions before and after modification', function(t) {
//   t.plan(3)
//   var obj = {name: 'before'};
//   injector.anything('Before', obj);
//   var injectFn = function(Before) {
//     return Before
//   };
//
//   var firstRun = injector.inject(injectFn);
//   t.equal(firstRun.name, 'before')
//
//   injector.replace('Before', {name: 'after'});
//   var modified = injector.get('Before');
//   t.equal(modified.name, 'after');
//
//   var secondRun = injector.inject(injectFn);
//   t.equal(secondRun.name, 'after');
//
// })