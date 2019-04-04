/**
 * @file deleting
 * @author Jim Bulkowski <jim.b@paperelectron.com>
 * @project magnum-di
 * @license MIT {@link http://opensource.org/licenses/MIT}
 */
import {MagnumDI} from "../src/"

describe('Deleting dependencies', () => {
  const injector = new MagnumDI()

  test('Unregistering', () => {
    injector.anything('A', {a: 'A'});
    injector.anything('B', {b: 'B'});
    expect(injector.get('A')).toEqual(expect.objectContaining({a: 'A'}))
    expect(injector.get('B')).toEqual(expect.objectContaining({b: 'B'}))

    injector.unregister('A');
    injector.unregister('B');

    expect(injector.get('A')).toBeNull()
    expect(injector.get('B')).toBeNull()

  })

  test('Reregistering', () => {
    injector.anything('A', {a: 'New A'});
    injector.anything('B', {b: 'New B'});
    expect(injector.get('A')).toEqual(expect.objectContaining({a: 'New A'}))
    expect(injector.get('B')).toEqual(expect.objectContaining({b: 'New B'}))

  })

});