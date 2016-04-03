/**
 * @file DI
 * @author Jim Bulkowski <jim.b@paperelectron.com>
 * @project magnum-di
 * @license MIT {@link http://opensource.org/licenses/MIT}
 */

'use strict';
var _ = require('lodash');
var debug = require('debug')('magnum-di');
var Dependencies = require('./Dependencies');

/**
 * @class MagnumDI
 */


/**
 * Provides an instance of the Magnum DI injector.
 * @name MagnumDI
 * @returns {MagnumDI}
 * @constructor
 */
function MagnumDI(){
  if(!(this instanceof MagnumDI)) return new MagnumDI();
  this.dependencies = new Dependencies();
  this.service('Injector', this)
}

/**
 * Registers an object, string, number or function.
 * @param {string} name Name to be used in the injected function
 * @param {object|array|number|string|function} item Item to be injected.
 * @returns {*} Returns provided dependency
 */

MagnumDI.prototype.service = function(name, item){
  if(!_.isString(name)){
    throw new TypeError("First parameter of DI.service() Must be a string.")
  }
  this.validateName(name);
  if(!item){
    throw new TypeError("Missing second parameter of DI.service()")
  }

  /**
   * Wrap a service function in an outer function.
   */
  if(_.isFunction(item)){
    return this.dependencies.set(name, function(){
      return item
    })
  }
  return this.dependencies.set(name, item)
};

/**
 * When injected, calls as a constructor with new.
 * @param {string} name Name to be used in the injected function.
 * @param {function} fn Function to be called with new.
 * @returns {function} Returns provided function
 */
MagnumDI.prototype.instance = function(name, fn){
  if(!_.isString(name)){
    throw new TypeError("First parameter of DI.instance() Must be a string.")
  }
  this.validateName(name);
  if(!_.isFunction(fn)){
    throw new TypeError("Second parameter of DI.instance() Must be a function.")
  }

  return this.dependencies.set(name, function(){
    return new fn()
  })
};

/**
 * When injected, calls the passed function. Returns the result of that call.
 * @param {string} name Name to be used in the injected function
 * @param {function} fn Function to be called by injector.
 * @returns {function} Retuens provided function.
 */
MagnumDI.prototype.factory = function(name, fn){
  var self = this;
  if(!_.isString(name)){
    throw new TypeError("First parameter of DI.factory() Must be a string.")
  }
  this.validateName(name);
  if(!_.isFunction(fn)){
    throw new TypeError("Second parameter of DI.factory() Must be a function.")
  }

  return this.dependencies.set(name,function(){
    return self.inject(fn);
  });
}

/**
 * Merges supplied object into the object registered for <name>, if <name> doesn't exist it will be created.
 * @param {String} name Dependency object to modify
 * @param {Object} merge Object to merge with existing dependency
 * @returns {*} Returns provided dependency
 */
MagnumDI.prototype.merge = function(name, merge){
  var toModify = this.dependencies.get(name);
  if(!toModify){
    return this.service(name, merge)
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
 * Returns the specified dependency.
 * @param {string} name Dependency to retrieve.
 * @returns {*|null} The named dependency item, or null.
 */
MagnumDI.prototype.get = function(name) {
  var dependency = this.dependencies.get(name)
  if(_.isFunction(dependency)){
    return dependency()
  }
  debug(_.keys(this.dependencies.getAll()));
  return dependency
};

/**
 * Modifies a registered service object.
 * @param {String} name Dependency object to modify.
 * @param {Object} replacement Object to replace current registered object.
 * @returns {Object} Replaced dependency
 */
MagnumDI.prototype.replace = function(name, replacement){
  var toModify = this.dependencies.get(name);
  if(_.isFunction(toModify)){
    throw new Error('Magnum DI cannot replace an injectable function')
  }
  if(_.isFunction(replacement)){
    throw new TypeError('Replacement value for injector.replace cannot be a function');
  }
  return this.dependencies.set(name,replacement)
};

/**
 * Removes the specified dependency.
 * @param {string} name Registered dependency to remove.
 * @returns {boolean} The result of the operation.
 */
MagnumDI.prototype.unregister = function(name){
  return this.dependencies.remove(name)
};

/**
 * Runs the given function with args injected and with an optional context object.
 * @param {function|string} fnOrstr function - inject args and run, string - Return the named dependency.
 * @param {object} thisArg Calling context.
 * @returns {*} Returns the result of the called function.
 */
MagnumDI.prototype.inject = function(fnOrstr, thisArg) {

  if(_.isString(fnOrstr)){
    return this.dependencies.get(fnOrstr)
  }
  if(!_.isFunction(fnOrstr)){
    return null
  }

  var self = this;
  var FUNC_ARGS = /^function\s*[^\(]*\(\s*([^\)]*)\)/m;
  var STRIP_COMMENTS = /((\/\/.*$)|(\/\*[\s\S]*?\*\/))/mg;
  var args = fnOrstr.toString().match(FUNC_ARGS)[1].split(',');
  var depArray = _.map(args, function(arg) {
    arg = arg.replace(/[\s\r\n]+/, '');
    if(arg === 'Injector'){
      return self;
    }
    var injectDep = self.dependencies.get(arg)
    if(_.isNull(injectDep)) {
      return null
    }
    if(_.isFunction(injectDep)){
      return injectDep()
    }
    return injectDep
  });
  thisArg = (!thisArg) ? null : thisArg
  return fnOrstr.apply(thisArg, depArray)
}

/**
 * Checks that the param name attempting to be registered is valid JS identifier.
 * @private
 * @param name
 */
MagnumDI.prototype.validateName = function(name){
  var noSpacesOrDashes = /\s+|-+/g
  if(noSpacesOrDashes.test(name)){
    throw new TypeError('Dependency name must be a valid javascript variable, no spaces, tabs, or dashes.')
  }
  if(this.dependencies.get(name)){
    throw new TypeError('Dependency "' + name + '" is already registered.')
  }
};


module.exports = MagnumDI;