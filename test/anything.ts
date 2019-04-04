/**
 * @file services
 * @author Jim Bulkowski <jim.b@paperelectron.com>
 * @project magnum-di
 * @license MIT {@link http://opensource.org/licenses/MIT}
 */

import {MagnumDI} from "../src/"

describe('Magnum DI basic injectable', function () {
  const injector = new MagnumDI()

  test('Throws with no args', () => {
    expect(() => {
      //@ts-ignore
      injector.anything()
    }).toThrowError(new Error('First parameter of MagnumDI.anything() Must be a string.'))
  })
  test('Throws with missing name: Object', () => {
    expect(() => {
      //@ts-ignore
      injector.anything({})
    }).toThrowError(new Error('First parameter of MagnumDI.anything() Must be a string.'))
  })
  test('Throws with missing name: function', () => {
    expect(() => {
      //@ts-ignore
      injector.anything(() => {
      })
    }).toThrowError(new Error('First parameter of MagnumDI.anything() Must be a string.'))
  })
  test('Throws with missing name: number', () => {
    expect(() => {
      //@ts-ignore
      injector.anything(10)
    }).toThrowError(new Error('First parameter of MagnumDI.anything() Must be a string.'))
  })
  test('Throws with missing dependency', () => {
    expect(() => {
      //@ts-ignore
      injector.anything('Test')
    }).toThrowError(new Error('Test: Missing second parameter of MagnumDI.anything()'))
  })

  test('Throws with duplicate injectable', () => {
    injector.anything('Duplicate', {})
    expect(() => {
      //@ts-ignore
      injector.anything('Duplicate', {})
    }).toThrowError(new Error('Dependency "Duplicate" is already registered.'))
  })

  test('Throws with bad injectable name: spaces', () => {
    expect(() => {
      //@ts-ignore
      injector.anything('this wont work', {})
    }).toThrowError(new Error('this wont work: Dependency name must be a valid javascript variable, no spaces, tabs, or dashes.'))
  })

  test('Throws with bad injectable name: hyphens', () => {
    expect(() => {
      //@ts-ignore
      injector.anything('this-also-wont-work', {})
    }).toThrowError(new Error('this-also-wont-work: Dependency name must be a valid javascript variable, no spaces, tabs, or dashes.'))
  })

  test('anything usage', () => {
    injector.anything('Service', {name: 'Service', special: Math.random()})
    injector.anything('Constructor', function () {
      return {name: 'Constructor'}
    })
    let A = injector.get('Service');
    let B = injector.get('Service');
    let C = injector.get('Constructor')();
    expect(A.name).toEqual('Service')
    expect(B.name).toEqual('Service')
    expect(C.name).toEqual('Constructor')
    expect(A.special).toEqual(B.special)
  })
});

