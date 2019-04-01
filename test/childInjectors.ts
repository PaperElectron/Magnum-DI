/**
 * @file childInjectors
 * @author Jim Bulkowski <jim.b@paperelectron.com>
 * @project magnum-di
 * @license MIT {@link http://opensource.org/licenses/MIT}
 */
import {MagnumDI} from "../src/MagnumDI"
describe('Creating Child Injectors', () => {
  const injector = new MagnumDI()

  test('Overrideable parent', () => {
    injector.service('bob', {name: 'Bob'})
    injector.service('Config', {name: 'Parent'})
    let bob = injector.inject('bob')
    expect(bob).toEqual(expect.objectContaining({name: 'Bob'}))
  })

  test('Children can overide parents', () => {
    let child = injector.createChild('child')
    child.service('bob', {name: 'Bob Jr.'})
    let bob = child.inject('bob')
    expect(bob).toEqual(expect.objectContaining({name: 'Bob Jr.'}))
  })

  test('Grandchildren can overide parents', () => {
    let child = injector.getChild('child')
    let grandchild = child.createChild('grandchild')
    grandchild.service('bob', {name: 'Bob III'})
    let bob = grandchild.inject('bob')
    expect(bob).toEqual(expect.objectContaining({name: 'Bob III'}))
  })

  test('Dependencies are resolved upward if not found on local injector', () => {
    let grandchild = injector.getChild('grandchild')
    expect(grandchild).toEqual(expect.objectContaining({name: 'grandchild'}))
    let Config = grandchild.inject('Config')
    expect(Config).toEqual(expect.objectContaining({name: 'Parent'}))
  })

})