/**
 * @file NamedInjectors
 * @author Jim Bulkowski <jim.b@paperelectron.com>
 * @project magnum-di
 * @license MIT {@link http://opensource.org/licenses/MIT}
 */

import {difference} from 'lodash/fp'
import {MagnumDI} from "../src/MagnumDI"


describe('Creates and finds named injectors.', function () {
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
});