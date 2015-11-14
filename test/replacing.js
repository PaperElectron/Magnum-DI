/**
 * @file modifying
 * @author Jim Bulkowski <jim.b@paperelectron.com>
 * @project magnum-di
 * @license MIT {@link http://opensource.org/licenses/MIT}
 */

var should = require('should');

var injector = require('../index');

describe('Replacing contents of a Dependency', function(){

  context('Can set an object.', function(){
    injector.service('modify', {name: "modify"});
    var toModify = injector.get('modify');

    it('Should set the correct new object', function() {
      toModify.name.should.equal('modify')
    });

    it('Should be possible to modify an object after registering.', function() {

      toModify = injector.replace('modify', {name: 'modified', other: 'defined'});
      toModify.name.should.equal('modified');
      toModify.other.should.equal('defined');
    });
  });

  context('Returning the correct object after modification', function(){
    it('Should return the modified object going forward.', function() {
      var modified = injector.get('modify');
      modified.name.should.equal('modified');
      modified.other.should.equal('defined');
    });
  });

  context('Rejecting improper parameters', function(){
    injector.service('improper', {name: 'improper'});
    injector.factory('improperFactory', function(){});
    injector.instance('improperInstance', function(){});
    var improper = injector.get('improper');
    it('Should throw on attempt to assign a function when modifying', function() {
      (function() {
        injector.replace('improper', function(){})
      }).should.throw();
    });

    it('Should throw on attempt to modify a factory with an object', function() {
      (function() {
        injector.replace('improperFactory', {name: 'improperFactory'})
      }).should.throw();
    });

    it('Should throw on attempt to modify an instance with an object', function() {
      (function() {
        injector.replace('improperInstance', {name: 'improperInstance'})
      }).should.throw();
    });
  });

  context('Injecting functions before and after modification', function(){
    var obj = {name: 'before'};
    injector.service('Before', obj);
    var injectFn = function(Before){return Before};

    it('Should have the correct values after being run by injector', function() {
      var firstRun = injector.inject(injectFn);
      firstRun.name.should.equal('before')
    });

    it('Should modify the value', function() {
      injector.replace('Before', {name: 'after'});
      var modified = injector.get('Before');
      modified.name.should.equal('after')
    });

    it('Should have the correct values after being run by the injector, after modification', function() {
      var secondRun = injector.inject(injectFn);
      secondRun.name.should.equal('after')
    });
  })
});