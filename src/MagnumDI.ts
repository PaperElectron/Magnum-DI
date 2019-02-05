import * as _ from 'lodash'
import * as Debug from 'debug'
import dependencies from "./Dependencies"
import {getFunctionParams} from "./getFunctionParams"

const debug = Debug('magnum-di')

export class MagnumDI {
  private dependencies
  readonly parent

  constructor(parent?: MagnumDI){
    this.dependencies = dependencies()
    this.parent = parent || null
    this.service('Injector', this)
  }
  /**
   * Creates a Child instance of the current injector.
   * Calls to .get or .inject will first search this injector, if a parameter is found it will return it
   * if not it will continue up the tree until a value is found or the topmost instance is reached.
   * @return {MagnumDI}
   */
  createChild() : MagnumDI {
    return new MagnumDI(this)
  }

  /**
   * Returns the parent injector, or null if it has no parent.
   *
   * @param getTopLevel walks up the tree and returns the first injector where parent === null ie. the first ancestor.
   */
  getParent(getTopLevel = false): MagnumDI {
    if(getTopLevel){
      let parent = this.getParent()
      while(parent){
        let up = parent.getParent()
        if(up === null){
          return parent
        }
        parent = up
      }
    }

    return this.parent
  }

  /**
   * Returns all keys registered for this injector.
   * @return {array}
   */
  getKeys() : string[] {
    return _.keys(this.dependencies.getAll())
  }
  /**
   * Registers an object, string, number or function.
   * @param {string} name Name to be used in the injected function
   * @param {object|array|number|string|function} item Item to be injected.
   * @returns {*} Returns provided dependency
   */

  service<T>(name: string, item: T) {
    if(!_.isString(name)){
      throw new TypeError("First parameter of DI.service() Must be a string.")
    }
    this.validateName(name);
    if(!item){
      throw new TypeError(name + ": Missing second parameter of DI.service()")
    }

    /**
     * Wrap a service function in an outer function.
     * This allows the original function to be returned when requested.
     * If this was not wrapped, it would simply execute the function and return
     * whatever it returned.
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
  instance(name: string, fn: FunctionConstructor) {
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
   * @returns {function} Returns provided function.
   */
  factory(name: string, fn: Function) {
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
  get(name: string) {

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
  replace(name: string, replacement) {
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
  unregister(name: string) {
    return this.dependencies.remove(name)
  };

  /**
   * Runs the given function with args injected and with an optional context object.
   * @param {function|string} fnOrstr function - inject args and run, string - Return the named dependency.
   * @param {object} thisArg Calling context.
   * @returns {*} Returns the result of the called function.
   */
  inject(fnOrstr, thisArg?) {
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
    let noSpacesOrDashes = /\s+|-+/g
    if(noSpacesOrDashes.test(name)){
      throw new TypeError(name +': Dependency name must be a valid javascript variable, no spaces, tabs, or dashes.')
    }
    if(this.dependencies.get(name)){
      throw new TypeError('Dependency "' + name + '" is already registered.')
    }
  };
}

// export = MagnumDI