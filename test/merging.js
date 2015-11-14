/**
 * @file merging
 * @author Jim Bulkowski <jim.b@paperelectron.com>
 * @project magnum-di
 * @license MIT {@link http://opensource.org/licenses/MIT}
 */

var should = require('should');

var injector = require('../index');

describe('Merging contents of a Dependency', function(){
  context('Merging objects', function() {
    injector.service('merge', {});

    it('Should be a blank object', function() {
      var merge = injector.get('merge');
      merge.should.be.an.Object;
      merge.should.be.empty()
    });

    it('Should merge an object', function() {
      var toMerge = {name: 'merge'};
      injector.merge('merge', toMerge);
      var merge = injector.get('merge');
      merge.should.have.property('name');
      merge.name.should.equal('merge')
    });

    it('Should merge a 2nd object', function() {
      var toMerge = {location: 'Atlanta'};
      injector.merge('merge', toMerge);
      var merge = injector.get('merge');
      merge.should.have.property('name');
      merge.should.have.property('location');
      merge.name.should.equal('merge');
      merge.location.should.equal('Atlanta')
    });
  })
});