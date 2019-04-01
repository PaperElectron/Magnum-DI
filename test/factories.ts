/**
 * @file factories
 * @author Jim Bulkowski <jim.b@paperelectron.com>
 * @project magnum-di
 * @license MIT {@link http://opensource.org/licenses/MIT}
 */

import {MagnumDI} from "../src/"

describe('Magnum DI factories', () => {
  const injector = new MagnumDI()
  injector.factory('Factory', function () {
    return {name: 'Factory', rando: Math.random()}
  })

  test('Throws with no args', () => {
    expect(() => {
      //@ts-ignore
      injector.factory()
    }).toThrowError(new Error('First parameter of MagnumDI.factory() Must be a string.'))
  })

  test('Throws with no name', () => {
    expect(() => {
      //@ts-ignore
      injector.factory({})
    }).toThrowError(new Error('First parameter of MagnumDI.factory() Must be a string.'))
  })

  test('Throws with no dependency', () => {
    expect(() => {
      //@ts-ignore
      injector.factory('Test')
    }).toThrowError(new Error('Test: Second parameter of MagnumDI.factory() Must be a function.'))
  })

  test('Throws with incorrect dep type', () => {
    expect(() => {
      //@ts-ignore
      injector.factory('Test', {})
    }).toThrowError(new Error('Test: Second parameter of MagnumDI.factory() Must be a function.'))
  })

  test('Factories return new objects every time they are requested from the injector', () => {
    let A = injector.get('Factory');
    let B = injector.get('Factory');
    expect(A.name).toEqual('Factory')
    expect(B.name).toEqual('Factory')
    expect(A.rando).not.toEqual(B.rando)
  })

  test('Parameterized factories.', () => {
    injector.service('ForFactory', {factoryArg: 'hello'})
    injector.factory('Parameterized', function (ForFactory) {
      return ForFactory
    })
    expect(injector.get('ForFactory')).toEqual(expect.objectContaining({factoryArg: 'hello'}))

    injector.inject((Parameterized) => {
      expect(Parameterized.factoryArg).toEqual('hello')
    })
  })

  test('String arg to .inject returns factory result', () => {
    injector.factory('GetFactory', function () {
      return {name: 'GetFactory'}
    })

    let Got = injector.inject('GetFactory')

    expect(Got).toEqual(expect.objectContaining({name: 'GetFactory'}))
  })
})
