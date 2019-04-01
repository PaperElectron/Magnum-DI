/**
 * @file getFunctionParams
 * @author Jim Bulkowski <jim.b@paperelectron.com>
 * @project magnum-di
 * @license MIT {@link http://opensource.org/licenses/MIT}
 */
import {getFunctionParams} from "../src/module/getFunctionParams";

describe('Returns arguments for most functions it receives', function () {

  test('Anonymous function expressions', () => {
    let anon = function (A, B, C, D, E) {
    }
    let args = getFunctionParams(anon)
    expect(args.length).toEqual(5)
    expect(args).toEqual(['A', 'B', 'C', 'D', 'E'])
  })

  test('Named function expressions', () => {
    function notAnon(A, B, C, D, E) {
    }

    let args = getFunctionParams(notAnon)
    expect(args.length).toEqual(5)
    expect(args).toEqual(['A', 'B', 'C', 'D', 'E'])
  })

  test('Arrow functions', () => {
    let anon = (A, B, C, D, E) => {
    }
    let args = getFunctionParams(anon)
    expect(args.length).toEqual(5)
    expect(args).toEqual(['A', 'B', 'C', 'D', 'E'])
  })

  test('IIFE functions', () => {
    let anon = (function () {
      return (A, B, C, D, E) => {
      }
    })()
    let args = getFunctionParams(anon)
    expect(args.length).toEqual(5)
    expect(args).toEqual(['A', 'B', 'C', 'D', 'E'])
  })

  test('Bound function will throw.', () => {
    let def = function (A, B, C, D, E) {
    }
    let anon = def.bind({})
    expect(() => {
      getFunctionParams(anon)
    }).toThrow()
  })
});


// tap.test('Returns arguments for most functions it receives', (t) => {
//
//
//
//
//   t.test('Bound function expressions will throw', (t) => {
//     let def = function(A,B,C,D,E){}
//     let anon = def.bind({})
//
//     t.throws(function() {
//       getFunctionParams(anon)
//     }, 'Parser will throw, do not use bound functions with the injector.')
//
//     t.done()
//   })
//
//   t.done()
// })