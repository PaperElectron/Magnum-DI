/**
 * @file magnum-di
 * @author Jim Bulkowski <jim.b@paperelectron.com>
 * @project magnum-di
 * @license MIT {@link http://opensource.org/licenses/MIT}
 */

var _ = require('lodash');
/**
 * Magnum DI framework.
 * @module injector
 */
exports.dependencies = {}

/**
 * When injected, calls the passed function. Returns the result of that call.
 * @param {string} name Name to be used in the injected function
 * @param {function} fn Function to be called by injector.
 */
exports.factory = function(name, fn){
  if(!_.isString(name)){
    throw new TypeError("First parameter of DI.factory() Must be a string.")
  }
  exports.validateName(name);
  if(!_.isFunction(fn)){
    throw new TypeError("Second parameter of DI.factory() Must be a function.")
  }
  exports.dependencies[name] = function(){
    return fn()
  }
}

/**
 * When injected, calls as a constructor with new.
 * @param {string} name Name to be used in the injected function.
 * @param {function} fn Function to be called with new.
 */
exports.instance = function(name, fn){
  if(!_.isString(name)){
    throw new TypeError("First parameter of DI.instance() Must be a string.")
  }
  exports.validateName(name);
  if(!_.isFunction(fn)){
    throw new TypeError("Second parameter of DI.instance() Must be a function.")
  }
  exports.dependencies[name] = function(){
    return new fn()
  }
}

/**
 * Registers an object, string, number. Anything but a function.
 * @param {string} name Name to be used in the injected function
 * @param {object|array|number|string} item Item to be injected.
 */
exports.service = function(name, item){
  if(!_.isString(name)){
    throw new TypeError("First parameter of DI.service() Must be a string.")
  }
  exports.validateName(name);
  if(!item){
    throw new TypeError("Missing second parameter of DI.service()")
  }
  if(_.isFunction(item)){
    throw new TypeError('Second parameter of DI.service() cannot be a function.')
  }
  exports.dependencies[name] = item
}

/**
 * Runs the given function with args injected and with an optional context object.
 * @param {function} fn function to inject args into and run.
 * @param {object} thisArg Calling context.
 * @returns {*}
 */
exports.inject = function(fn, thisArg) {
  var FUNC_ARGS = /^function\s*[^\(]*\(\s*([^\)]*)\)/m;
  var STRIP_COMMENTS = /((\/\/.*$)|(\/\*[\s\S]*?\*\/))/mg;
  var args = fn.toString().match(FUNC_ARGS)[1].split(',');
  var depArray = _.map(args, function(arg) {
    arg = arg.replace(/[\s\r\n]+/, '');
    if(arg === 'Injector'){
      return exports
    }
    var injectDep = exports.dependencies[arg]
    if(_.isUndefined(injectDep)) {
      return null
    }
    if(_.isFunction(injectDep)){
      return injectDep()
    }
    return injectDep
  });
  thisArg = (!thisArg) ? null : thisArg
  return fn.apply(thisArg, depArray)
}

/**
 * @private
 * @param name
 */
exports.validateName = function(name){
  var noSpacesOrDashes = /\s+|-+/g
  if(noSpacesOrDashes.test(name)){
    throw new TypeError('Dependency name must be a valid javascript variable, no spaces, tabs, or dashes.')
  }
  if(exports.dependencies[name]){
    throw new TypeError('A dependency with that name is already registered.')
  }
};

/**
 * Returns the specified dependency.
 * @param {string} name Dependency to retrieve.
 * @returns {*} The asked for dependency item.
 */

exports.get = function(name) {
  if(_.isFunction(exports.dependencies[name])){
    return exports.dependencies[name]()
  }
  return exports.dependencies[name]
}
/**
 * Removes the specified dependency.
 * @param {string} name
 */
exports.unregister = function(name){
  delete exports.dependencies[name]
}

/**
 * Adds itself to the dependencies object.
 */
exports.service('Injector', exports);
