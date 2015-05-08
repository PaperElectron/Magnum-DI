/**
 * @file Injector
 * @author Jim Bulkowski <jim.b@paperelectron.com>
 * @project magnum-di
 * @license MIT {@link http://opensource.org/licenses/MIT}
 */


var should = require('should');

var injector = require('../index');

describe('Injector should work as designed.', function() {

  describe('registering dependencies', function() {

    context('should enforce uniqueness and proper dependency names.', function() {
      it('should throw on duplicate dependency names', function() {
        (function() {
          injector.service('noThrow', {})
        }).should.not.throw();

        (function() {
          injector.service('noThrow', {})
        }).should.throw();
      });
      it('should throw on invalid names', function() {
        (function() {
          injector.service('This is bad', {})
        }).should.throw();

        (function() {
          injector.service('This-also-bad', {})
        }).should.throw();

        (function() {
          injector.service('validname', {})
        }).should.not.throw();
      });
    })

    context('should enforce valid function names', function() {
      it('should throw on invalid function name', function() {
        (function() {
          injector.service('noThrow1', {})
        }).should.not.throw();

        (function() {
          injector.service('noThrow1', {})
        }).should.throw();
      });
    })

    context('should add an instance constructor.', function() {
      it('should work as expected', function() {
        injector.instance('Instance', function() {
          this.name = 'Instance'
          this.setup = function(name) {
            this.name = name
            return this
          }
          this.get = function() {
            return this.name
          }
        })
      })

      it('should throw when name is missing or of wrong type', function() {
        (function() {
          injector.instance()
        }).should.throw();

        (function() {
          injector.instance({})
        }).should.throw();
      })

      it('should throw when item arg is missing or of wrong type', function() {
        (function() {
          injector.instance('Test')
        }).should.throw();

        (function() {
          injector.instance('Test', {})
        }).should.throw();
      })

      it('should return new instances', function() {
        var A = injector.get('Instance').setup('bob');
        var B = injector.get('Instance').setup('tom');
        A.get().should.equal('bob');
        B.get().should.equal('tom');
        (A.constructor).should.equal(B.constructor)
      })

    })

    context('should add a factory.', function() {

      it('should work as expected', function() {
        injector.factory('Factory', function() {
          return {name: 'Factory'}
        })
      })

      it('should throw when name is missing or of wrong type', function() {
        (function() {
          injector.factory()
        }).should.throw();

        (function() {
          injector.factory({})
        }).should.throw();
      })

      it('should throw when item arg is missing or of wrong type', function() {
        (function() {
          injector.factory('Test')
        }).should.throw();

        (function() {
          injector.factory('Test', {})
        }).should.throw();
      })

    });

    context('should add a service.', function() {

      it('should work as expected', function() {
        injector.service('Service', {name: 'Service'})
      })

      it('should throw when name is missing or of wrong type', function() {
        (function() {
          injector.service()
        }).should.throw();

        (function() {
          injector.service({})
        }).should.throw();

        (function() {
          injector.service(function() {
          })
        }).should.throw();
      })

      it('should throw when item arg is missing or of wrong type', function() {
        (function() {
          injector.service('Test')
        }).should.throw();

        (function() {
          injector.service('Test', function() {
          })
        }).should.throw();
      })

    })
  });
  describe('Using the module', function() {
    context('should run a function', function() {

      it('should have the correct argument values', function() {
        injector.inject(function(Service, Factory, Instance) {
          Service.name.should.equal('Service')
          Factory.name.should.equal('Factory')
          Instance.name.should.equal('Instance')
        })
      })

      it('should return null for unkown values.', function() {
        injector.inject(function(Foo) {
          should(Foo).equal(null)
        })
      })
    });
  })
});