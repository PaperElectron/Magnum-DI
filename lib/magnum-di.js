/**
 * @file magnum-di
 * @author Jim Bulkowski <jim.b@paperelectron.com>
 * @project magnum-di
 * @license MIT {@link http://opensource.org/licenses/MIT}
 */

var _ = require('lodash');
var debug = require('debug')('magnum-di');
/**
 * Magnum DI framework.
 * @module injector
 */
var dependencies = {}
//exports.dependencies = {}

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
  dependencies[name] = function(){
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
  dependencies[name] = function(){
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
    //throw new TypeError('Second parameter of DI.service() cannot be a function.')
    return dependencies[name] = function(){
      return item
    }
  }
  dependencies[name] = item
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
    var injectDep = dependencies[arg]
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
  if(dependencies[name]){
    throw new TypeError('A dependency with that name is already registered.')
  }
};

/**
 * Returns the specified dependency.
 * @param {string} name Dependency to retrieve.
 * @returns {*} The asked for dependency item.
 */

exports.get = function(name) {
  if(_.isFunction(dependencies[name])){
    return dependencies[name]()
  }
  debug(_.keys(dependencies));
  return dependencies[name]
}
/**
 * Removes the specified dependency.
 * @param {string} name Registered dependency to remove.
 */
exports.unregister = function(name){
  delete dependencies[name]
}

/**
 * Modifies a registered service object.
 * @param {String} name Dependency object to modify.
 * @param {Object} replacement Object to replace current registered object.
 * @returns {Object} Replaced dependency
 */
exports.replace = function(name, replacement){
  var toModify = dependencies[name];
  if(_.isFunction(toModify)){
    throw new Error('Magnum DI cannot replace an injectable function')
  }
  if(_.isFunction(replacement)){
    throw new TypeError('Replacement value for injector.replace cannot be a function');
  }
  return dependencies[name] = replacement
}

/**
 * Merges supplied object into the object registered for <name>, if <name> doesn't exist it will be created.
 * @param {String} name Dependency object to modify
 * @param {Object} merge Object to merge with existing dependency
 */
exports.merge = function(name, merge){
  var toModify = dependencies[name];
  if(!toModify){
    return exports.service(name, merge)
  }
  if(_.isFunction(toModify)){
    throw new Error('Magnum DI cannot merge an injectable function')
  }
  if(_.isFunction(merge)){
    throw new TypeError('Merge value for injector.merge cannot be a function');
  }

  return _.merge(toModify, merge)
};
/**
 * Adds itself to the dependencies object.
 */
exports.service('Injector', exports);
