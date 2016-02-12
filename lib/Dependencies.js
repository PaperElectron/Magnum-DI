/**
 * @file Dependencies
 * @author Jim Bulkowski <jim.b@paperelectron.com>
 * @project magnum-di
 * @license MIT {@link http://opensource.org/licenses/MIT}
 */

'use strict';

/**
 *
 * @module Dependencies
 */

module.exports = Dependencies;

function Dependencies(){
  var dependencies = {};

  this.get = function(prop){
    return dependencies[prop] || null
  };

  this.set = function(prop, obj){
    return dependencies[prop] = obj;
  };

  this.getAll  = function(){
    return dependencies
  }

  this.remove = function(prop){
    delete dependencies[prop]
  }
}

