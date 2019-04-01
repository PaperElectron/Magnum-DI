/**
 * @file injector
 * @author Jim Bulkowski <jim.b@paperelectron.com>
 * @project magnum-di
 * @license MIT {@link http://opensource.org/licenses/MIT}
 */

import {MagnumDI} from "../src/MagnumDI"

describe('Injecting Dependencies', () => {
  let injector = new MagnumDI()
  injector.service('Service', {name: 'Service'});

  injector.factory('Factory', function () {
    return {name: 'Factory'}
  });


  injector.instance('Instance', class InstanceLike {
    name: string

    constructor() {
      this.name = 'InstanceLike'
    }
  });

  injector.merge('Merge', {name: 'Merge'});
  injector.merge('Merge', {a: 'A'});
  injector.merge('Merge', {b: 'B'});


  test('Function dependency Injecting', () => {
    injector.inject((Merge, Factory, Service, Instance) => {
      expect(Service.name).toEqual('Service')
      expect(Factory.name).toEqual('Factory')
      expect(Instance.name).toEqual('InstanceLike')
      expect(Merge.name).toEqual('Merge')
      expect(Merge.b).toEqual('B')
    })
  })

  test('Unfound Deps are present but null', () => {
    injector.inject(function (Foo) {
      expect(Foo).toBeNull()
    });
  })

  test('This arg can be provided.', () => {
    injector.inject(function () {
      expect(this.name).toEqual('thisArg')
    }, {name: 'thisArg'})
  })

  test('The injector can inject itself.', () => {
    injector.inject(function (Injector) {
      expect(Injector).toBeInstanceOf(MagnumDI)
    })
  })

  test('Calling .inject with a string argument will return the stored item', () => {
    expect(injector.inject('Service').name).toEqual('Service')
  })

  test('Calling .inject with a string argument not registered will return null', () => {
    expect(injector.inject('Foo')).toBeNull()
  })

  test('Calling .inject with an argument other than a function or string will return null', () => {
    expect(injector.inject(new Map())).toBeNull()
    expect(injector.inject(new Set())).toBeNull()
    expect(injector.inject(10)).toBeNull()
    expect(injector.inject(/not a string/)).toBeNull()
    expect(injector.inject([1,2,3])).toBeNull()
  })
});

