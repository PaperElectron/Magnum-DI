/**
 * @file childInjectors
 * @author Jim Bulkowski <jim.b@paperelectron.com>
 * @project magnum-di
 * @license MIT {@link http://opensource.org/licenses/MIT}
 */
import {MagnumDI} from "../src/"
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

  test('Injectors can get children below them.',() => {
    let injector = new MagnumDI()
    let namespace = injector.createChild('@pomOfficial')
    let good = namespace.createChild('goodApp')
    let better = namespace.createChild('betterApp')
    let best = namespace.createChild('bestApp')
    let cool = good.createChild('coolPlugin')
    let ok = good.createChild('okPlugin')
    let reasonable = good.createChild('reasonablePlugin')

    let okInjector = injector.getChild('okPlugin')

    expect(okInjector).toEqual(expect.objectContaining({name: 'okPlugin'}))
    expect(okInjector.getParent()).toEqual(expect.objectContaining({name: 'global'}))
  })

  test('.getParent throws when no parent injector is found.', () => {
    expect(() => {
      //@ts-ignore
      injector.getParent('Missing')
    }).toThrowError(new Error('Parent injector "Missing" not found.'))
  })

  test('.getChild returns null when it has no children', () => {
    const singleInjector = new MagnumDI()
    expect(singleInjector.getChild('noChildren')).toBeNull()
  })

  test('.getChild throws with no name argument', () => {
    expect(() => {
      //@ts-ignore
      injector.getChild()
    }).toThrowError(new Error('No childName argument provided.'))
  })

  test('.createChild throws with no name argument', () => {
    expect(() => {
      //@ts-ignore
      injector.createChild()
    }).toThrowError(new Error('Child injectors must be named.'))
  })

})