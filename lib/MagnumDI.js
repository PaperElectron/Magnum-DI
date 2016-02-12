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
 *
 * @module DI
 */

module.exports = DI;

function DI(){
  if(!(this instanceof DI)) return new DI();
  this.dependencies = new Dependencies();
  this.service('Injector', this)
}

/**
 * Registers an object, string, number. Anything but a function.
 * @param {string} name Name to be used in the injected function
 * @param {object|array|number|string} item Item to be injected.
 */

DI.prototype.service = function(name, item){
  if(!_.isString(name)){
    throw new TypeError("First parameter of DI.service() Must be a string.")
  }
  this.validateName(name);
  if(!item){
    throw new TypeError("Missing second parameter of DI.service()")
  }
  if(_.isFunction(item)){
    //throw new TypeError('Second parameter of DI.service() cannot be a function.')
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
 */
DI.prototype.instance = function(name, fn){
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
 */
DI.prototype.factory = function(name, fn){
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
 */
DI.prototype.merge = function(name, merge){
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
 * @returns {*} The asked for dependency item.
 */
DI.prototype.get = function(name) {
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
DI.prototype.replace = function(name, replacement){
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
 */
DI.prototype.unregister = function(name){
  return this.dependencies.remove(name)
};

/**
 * Checks that the param name attempting to be registered is valid JS identifier.
 * @private
 * @param name
 */
DI.prototype.validateName = function(name){
  var noSpacesOrDashes = /\s+|-+/g
  if(noSpacesOrDashes.test(name)){
    throw new TypeError('Dependency name must be a valid javascript variable, no spaces, tabs, or dashes.')
  }
  if(this.dependencies.get(name)){
    throw new TypeError('Dependency "' + name + '" is already registered.')
  }
};

/**
 * Runs the given function with args injected and with an optional context object.
 * @param {function} fn function to inject args into and run.
 * @param {object} thisArg Calling context.
 * @returns {*}
 */
DI.prototype.inject = function(fn, thisArg) {
  var self = this;
  var FUNC_ARGS = /^function\s*[^\(]*\(\s*([^\)]*)\)/m;
  var STRIP_COMMENTS = /((\/\/.*$)|(\/\*[\s\S]*?\*\/))/mg;
  var args = fn.toString().match(FUNC_ARGS)[1].split(',');
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
  return fn.apply(thisArg, depArray)
}
