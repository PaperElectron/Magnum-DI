import * as _fp from 'lodash/fp'
import * as esprima from 'esprima'
import get = Reflect.get;

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

export function getFunctionParams(toParse: Function): string[] {
  let strungFunc = esprima.parse(`let func = ${toParse.toString()}`)
  return extractParams(strungFunc)
}
