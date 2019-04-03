/**
 * @file chainCreation
 * @author Jim Bulkowski <jim.b@paperelectron.com>
 * @project magnum-di
 * @license MIT {@link http://opensource.org/licenses/MIT}
 */

import {MagnumDI} from "../src/"

describe('Injector Chain creation', () => {

  test('Creating complex chains', () => {
    const injector = new MagnumDI()
    let chainAABA = ['A', 'A', 'B', 'A']
    let deepAABA = injector.createChain(chainAABA)
    let deepAABB = injector.createChain(['A', 'A', 'B', 'B'])
    let deepAABC = injector.createChain(['A', 'A', 'B', 'C'])
    let deepABCA = injector.createChain(['A', 'B', 'C', 'A'])
    let deepABCB = injector.createChain(['A', 'B', 'C', 'B'])
    let deepABCC = injector.createChain(['A', 'B', 'C', 'C'])
    expect(chainAABA).toEqual(['A', 'A', 'B', 'A'])
    expect(deepAABA).toEqual(expect.objectContaining({name: 'A'}))
    expect(deepAABA.parent).toEqual(expect.objectContaining({name: 'B'}))

    expect(deepAABB).toEqual(expect.objectContaining({name: 'B'}))
    expect(deepAABB.parent).toEqual(expect.objectContaining({name: 'B'}))

    expect(deepAABC).toEqual(expect.objectContaining({name: 'C'}))
    expect(deepAABC.parent).toEqual(expect.objectContaining({name: 'B'}))

    expect(deepABCA).toEqual(expect.objectContaining({name: 'A'}))
    expect(deepABCA.parent).toEqual(expect.objectContaining({name: 'C'}))

    expect(deepABCB).toEqual(expect.objectContaining({name: 'B'}))
    expect(deepABCB.parent).toEqual(expect.objectContaining({name: 'C'}))

    expect(deepABCC).toEqual(expect.objectContaining({name: 'C'}))
    expect(deepABCC.parent).toEqual(expect.objectContaining({name: 'C'}))

    let searchChain = ['A', 'B', 'C']
    let foundABC = injector.findChain(searchChain)
    expect(searchChain).toEqual(['A', 'B', 'C'])
    expect(foundABC).toEqual(expect.objectContaining({name: 'C'}))

    let notFound = injector.findChain(['A', 'D'])
    expect(notFound).toBeNull()

  })

  test('Creating chains from children', () => {
    const injector = new MagnumDI()
    let deepAA = injector.createChain(['A', 'A'])

    expect(deepAA).toEqual(expect.objectContaining({name: 'A'}))
    expect(deepAA.parent).toEqual(expect.objectContaining({name: 'A'}))

    let deepAABB = deepAA.createChain(['B', 'B'])

    expect(deepAABB).toEqual(expect.objectContaining({name: 'B'}))
    expect(deepAABB.parent).toEqual(expect.objectContaining({name: 'B'}))

  })
});