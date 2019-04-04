/**
 * @file merge
 * @author Jim Bulkowski <jim.b@paperelectron.com>
 * @project magnum-di
 * @license MIT {@link http://opensource.org/licenses/MIT}
 */

import {MagnumDI} from "../src/"

describe('Merge Injectables', () => {
  const injector = new MagnumDI()
  injector.merge('merge', {})

  test('Adding properties to the merge injectable', () => {
    injector.merge('merge', {name: 'merge'})
    expect(injector.get('merge')).toEqual(expect.objectContaining({name: 'merge'}))
  })

  test('Adding additional properties to the merge injectable', () => {
    injector.merge('merge', {location: 'Atlanta'})
    expect(injector.get('merge')).toEqual(expect.objectContaining({name: 'merge', location: 'Atlanta'}))
  })

  test('Duplicate keys overwrite existing keys', () => {
    injector.merge('merge', {location: 'Cleveland'})
    expect(injector.get('merge')).toEqual(expect.objectContaining({name: 'merge', location: 'Cleveland'}))
  })

  test('Merging existing injectables not created with merge', () => {
    injector.anything('MergeService', {name: 'MergeService'})
    injector.merge('MergeService', {location: 'Atlanta'})
    expect(injector.inject('MergeService')).toEqual(expect.objectContaining({name: 'MergeService', location: 'Atlanta'}))
  })

  test('Merging into a factory throws', () => {
    injector.factory('MergeFactory', () => {

    })
    expect(() => {
      //@ts-ignore
      injector.merge('MergeFactory', {nope: 'This is bad.'})
    }).toThrowError(new Error('MergeFactory: MagnumDI.merge cannot merge an injectable function.'))
  })

  test('Merging into an instance throws', () => {
    injector.instance('MergeInstance', class MergeInstance{})
    expect(() => {
      //@ts-ignore
      injector.merge('MergeInstance', {nope: 'This is bad.'})
    }).toThrowError(new Error('MergeInstance: MagnumDI.merge cannot merge an injectable function.'))
  })

  test('Throws with no args', () => {
    expect(() => {
      //@ts-ignore
      injector.merge()
    }).toThrowError(new Error('First parameter of MagnumDI.merge() must be a string.'))
  })

  test('Throws with missing name', () => {
    expect(() => {
      //@ts-ignore
      injector.merge({})
    }).toThrowError(new Error('First parameter of MagnumDI.merge() must be a string.'))
  })

  test('Throws with missing dependency', () => {
    expect(() => {
      //@ts-ignore
      injector.merge('Test')
    }).toThrowError(new Error('Test: Missing second parameter of MagnumDI.merge()'))
  })

  test('Throws with wrong dependency type.', () => {
    expect(() => {
      //@ts-ignore
      injector.merge('Test', ()=>{})
    }).toThrowError(new Error('Test: Merge value for MagnumDI.merge() cannot be a function.'))
  })
});