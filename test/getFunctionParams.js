/**
 * @file getParams
 * @author Jim Bulkowski <jim.b@paperelectron.com>
 * @project magnum-di
 * @license MIT {@link http://opensource.org/licenses/MIT}
 */

'use strict';

const tap = require('tap')
const getFunctionParams = require('../lib/getFunctionParams')

tap.test('Returns arguments for most functions it receives', (t) => {

  t.test('Anonymous function expressions', (t) => {
    let anon = function(A,B,C,D,E){}
    let args = getFunctionParams(anon)
    t.equal(args.length, 5, 'Returns an array with the correct number of items')
    t.equal(args[0], 'A', 'Argument A is in correct position.')
    t.equal(args[1], 'B', 'Argument B is in correct position.')
    t.equal(args[2], 'C', 'Argument C is in correct position.')
    t.equal(args[3], 'D', 'Argument D is in correct position.')
    t.equal(args[4], 'E', 'Argument E is in correct position.')
    t.done()
  })

  t.test('Named functions', (t) => {
    function anon(A,B,C,D,E){}
    let args = getFunctionParams(anon)
    t.equal(args.length, 5, 'Returns an array with the correct number of items')
    t.equal(args[0], 'A', 'Argument A is in correct position.')
    t.equal(args[1], 'B', 'Argument B is in correct position.')
    t.equal(args[2], 'C', 'Argument C is in correct position.')
    t.equal(args[3], 'D', 'Argument D is in correct position.')
    t.equal(args[4], 'E', 'Argument E is in correct position.')
    t.done()
  })

  t.test('Arrow Functions', (t) => {
    let anon = (A,B,C,D,E) => {}
    let args = getFunctionParams(anon)
    t.equal(args.length, 5, 'Returns an array with the correct number of items')
    t.equal(args[0], 'A', 'Argument A is in correct position.')
    t.equal(args[1], 'B', 'Argument B is in correct position.')
    t.equal(args[2], 'C', 'Argument C is in correct position.')
    t.equal(args[3], 'D', 'Argument D is in correct position.')
    t.equal(args[4], 'E', 'Argument E is in correct position.')
    t.done()
  })

  t.test('IIFE returned functions', (t) => {
    let anon = (function(){
      return function(A,B,C,D,E){}
    })()
    let args = getFunctionParams(anon)
    t.equal(args.length, 5, 'Returns an array with the correct number of items')
    t.equal(args[0], 'A', 'Argument A is in correct position.')
    t.equal(args[1], 'B', 'Argument B is in correct position.')
    t.equal(args[2], 'C', 'Argument C is in correct position.')
    t.equal(args[3], 'D', 'Argument D is in correct position.')
    t.equal(args[4], 'E', 'Argument E is in correct position.')
    t.done()
  })

  t.test('Bound function expressions will throw', (t) => {
    let def = function(A,B,C,D,E){}
    let anon = def.bind({})

    t.throws(function() {
      getFunctionParams(anon)
    }, 'Parser will throw, do not use bound functions with the injector.')

    t.done()
  })

  t.done()
})