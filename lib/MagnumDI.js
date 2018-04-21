/**
 * @file DI
 * @author Jim Bulkowski <jim.b@paperelectron.com>
 * @project magnum-di
 * @license MIT {@link http://opensource.org/licenses/MIT}
 */

'use strict';

const _ = require('lodash');
const debug = require('debug')('magnum-di');
const Dependencies = require('./Dependencies');
const getFunctionParams = require('./getFunctionParams')


/**
 * Provides an instance of the Magnum DI injector.
 * @class MagnumDI
 * @returns {MagnumDI}
 */
class MagnumDI {
  constructor(parent) {
    // if(!(this instanceof MagnumDI)) return new MagnumDI(parent);
    this.dependencies = new Dependencies();
    this.service('Injector', this)
    this.parent = parent || null
  }

  /**
   * Creates a Child instance of the current injector.
   * Calls to .get or .inject will first search this injector, if a parameter is found it will return it
   * if not it will continue up the tree until a value is found or the topmost instance is reached.
   * @return {MagnumDI}
   */
  createChild() {
    return new MagnumDI(this)
  }

  /**
   * Returns all keys registered for this injector.
   * @return {array}
   */
  getKeys(){
    return _.keys(this.dependencies.getAll())
  }
  /**
   * Registers an object, string, number or function.
   * @param {string} name Name to be used in the injected function
   * @param {object|array|number|string|function} item Item to be injected.
   * @returns {*} Returns provided dependency
   */

  service(name, item) {
    if(!_.isString(name)){
      throw new TypeError("First parameter of DI.service() Must be a string.")
    }
    this.validateName(name);
    if(!item){
      throw new TypeError(name + ": Missing second parameter of DI.service()")
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
  }

  /**
   * When injected, calls as a constructor with new.
   * @param {string} name Name to be used in the injected function.
   * @param {function} fn Function to be called with new.
   * @returns {function} Returns provided function
   */
  instance(name, fn) {
    if(!_.isString(name)){
      throw new TypeError("First parameter of DI.instance() Must be a string.")
    }
    this.validateName(name);
    if(!_.isFunction(fn)){
      throw new TypeError(name + ": Second parameter of DI.instance() Must be a function.")
    }

    return this.dependencies.set(name, function(){
      return new fn()
    })
  }

  /**
   * When injected, calls the passed function. Returns the result of that call.
   * @param {string} name Name to be used in the injected function
   * @param {function} fn Function to be called by injector.
   * @returns {function} Retuens provided function.
   */
  factory(name, fn) {
    var self = this;
    if(!_.isString(name)){
      throw new TypeError("First parameter of DI.factory() Must be a string.")
    }
    this.validateName(name);
    if(!_.isFunction(fn)){
      throw new TypeError(name + ":Second parameter of DI.factory() Must be a function.")
    }

    return this.dependencies.set(name, function(){
      return self.inject(fn);
    });
  }

  /**
   * Merges supplied object into the object registered for <name>, if <name> doesn't exist it will be created.
   * @param {String} name Dependency object to modify
   * @param {Object} merge Object to merge with existing dependency
   * @returns {*} Returns provided dependency
   */
  merge(name, merge){
    var toModify = this.dependencies.get(name);
    if(!toModify){
      return this.service(name, merge)
    }
    if(_.isFunction(toModify)){
      throw new Error(name + ': Magnum DI cannot merge an injectable function')
    }
    if(_.isFunction(merge)){
      throw new TypeError(name + ': Merge value for injector.merge cannot be a function');
    }

    return _.merge(toModify, merge)
  };

  /**
   * Returns the specified dependency.
   * @param {string} name Dependency to retrieve.
   * @returns {*|null} The named dependency item, or null.
   */
  get(name) {

    var dependency = this.dependencies.get(name)
    if(_.isFunction(dependency)){
      return dependency()
    }
    if(!dependency){

      // if(this.parent){
      //   return this.parent.get(name)
      // }
      return (this.parent && this.parent.get(name)) || null
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
  replace(name, replacement) {
    var toModify = this.dependencies.get(name);
    if(_.isFunction(toModify)){
      throw new Error(name + ': Magnum DI cannot replace an injectable function')
    }
    if(_.isFunction(replacement)){
      throw new TypeError(name + ': Replacement value for injector.replace cannot be a function');
    }
    return this.dependencies.set(name,replacement)
  };

  /**
   * Removes the specified dependency.
   * @param {string} name Registered dependency to remove.
   * @returns {boolean} The result of the operation.
   */
  unregister(name) {
    return this.dependencies.remove(name)
  };

  /**
   * Runs the given function with args injected and with an optional context object.
   * @param {function|string} fnOrstr function - inject args and run, string - Return the named dependency.
   * @param {object} thisArg Calling context.
   * @returns {*} Returns the result of the called function.
   */
  inject(fnOrstr, thisArg) {
    if(_.isString(fnOrstr)){
      return this.get(fnOrstr)
    }
    if(!_.isFunction(fnOrstr)){
      return null
    }

    let argObjects = getFunctionParams(fnOrstr)

    let argArray = _.map(argObjects, (arg) => {
      if(arg === 'Injector'){
        return this;
      }

      return this.get(arg)
    })

    thisArg = (!thisArg) ? {} : thisArg
    return fnOrstr.apply(thisArg, argArray)
  }

  /**
   * Checks that the param name attempting to be registered is valid JS identifier.
   * @private
   * @param name
   */
  validateName(name) {
    var noSpacesOrDashes = /\s+|-+/g
    if(noSpacesOrDashes.test(name)){
      throw new TypeError(name +': Dependency name must be a valid javascript variable, no spaces, tabs, or dashes.')
    }
    if(this.dependencies.get(name)){
      throw new TypeError('Dependency "' + name + '" is already registered.')
    }
  };
}





module.exports = MagnumDI