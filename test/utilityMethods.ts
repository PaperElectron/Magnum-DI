/**
 * @file utilityMethods
 * @author Jim Bulkowski <jim.b@paperelectron.com>
 * @project magnum-di
 * @license MIT {@link http://opensource.org/licenses/MIT}
 */

import {difference} from 'lodash/fp'
import {MagnumDI} from "../src/MagnumDI"

const injector = new MagnumDI()

injector.service('Bob', {name: 'Bob'})
injector.service('Service', {name: 'Service'})
injector.factory('Factory', ()=>{})

describe('Returns an array of keynames', function () {
  test('Correctly returns keys',() => {
    let keys = injector.getKeys()
    expect(keys.length).toEqual(4)
    let diff = difference(['Injector', 'Bob', 'Service', 'Factory'], keys)
    expect(diff.length).toEqual(0)
  })
});

