/**
 * @file instances
 * @author Jim Bulkowski <jim.b@paperelectron.com>
 * @project magnum-di
 * @license MIT {@link http://opensource.org/licenses/MIT}
 */
import {MagnumDI} from "../src/MagnumDI"

describe('Instance Plugins', () => {
  const injector = new MagnumDI()

  class InstanceTest {
    name: string

    constructor() {
      this.name = 'Instance'
    }

    setup(name: string): InstanceTest {
      this.name = name
      return this
    }

    getName(): string {
      return this.name
    }
  }

  injector.instance('Instance', InstanceTest)
  test('Throws with no args', () => {
    expect(() => {
      //@ts-ignore
      injector.instance()
    }).toThrowError(new Error('First parameter of DI.instance() must be a string.'))
  })

  test('Throws with missing name', () => {
    expect(() => {
      //@ts-ignore
      injector.instance({})
    }).toThrowError(new Error('First parameter of DI.instance() must be a string.'))
  })

  test('Throws with missing dependency', () => {
    expect(() => {
      //@ts-ignore
      injector.instance('Test')
    }).toThrowError(new Error('Test: Second parameter of DI.instance() must be a class.'))
  })

  test('Throws with wrong dependency type.', () => {
    expect(() => {
      //@ts-ignore
      injector.instance('Test', {})
    }).toThrowError(new Error('Test: Second parameter of DI.instance() must be a class.'))
  })

  test('Instances are injected when requested', () => {
    let A = injector.get('Instance').setup('bob');
    let B = injector.get('Instance').setup('tom');
    expect(A.getName()).toEqual( 'bob')
    expect(B.getName()).toEqual('tom')
    expect(A.constructor).toEqual(B.constructor)
  })
});
