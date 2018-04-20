/**
 * @file getParams
 * @author Jim Bulkowski <jim.b@paperelectron.com>
 * @project magnum-di
 * @license MIT {@link http://opensource.org/licenses/MIT}
 */

'use strict';
const _fp = require('lodash/fp')
const esprima = require('esprima')
const argObjArray = _fp.get('body[0].declarations[0].init.params')
const toStringArray = _fp.map((item) => {
  return item.name
})
const extractParams = _fp.compose(
  toStringArray,
  argObjArray
)
/**
 * Gets the parameter names of a passed in function.
 * @module getParams
 */

module.exports = function(func){

  let strungFunc = esprima.parse(`let func = ${func.toString()}`)
  return extractParams(strungFunc)
}