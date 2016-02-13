# Magnum DI

## A super simple Key,Value Dependency Injection framework for NodeJS

[![NPM Version - Seeing this? Shilds.io is broken, again.][npm-image]][npm-url]
[![Linux][travis-image]][travis-url]
[![Code Coverage][coveralls-image]][coveralls-url]
```shell
npm install --save magnum-di
```

```javascript
//Load it up./
var injector = require('magnum-di')()

//Register some dependencies.
injector.service('MyService', {name: 'Bob', sayName: function(){console.log(this.name)}})

//inject them into your function
injector.inject(function(MyService){
    MyService.sayName() // -> Bob
})
```
# Why Dependency Injection?

* Managing complex applications with many files. Maintaining module dependencies in one location reduces errors
and makes an application easier to reason about.
* Procedurally loading files with dependencies becomes much easier.
* Ease of testing in isolation, mocking module dependencies becomes trivial. No need to use a module to fiddle with the internals of require to get a mocked object into your module. With DI just register a different module with the correct methods
and you are done mocking.

## Examples

### Express route definitions.

Here we register a dependency in our main application file, and use the injector to call the function
returned by the require('./UserModel) call.

Run this with `npm run example-server`

``` javascript

//userRoutes.js

module.exports = function(Router, User) {

  //Here Router and User will be injected.
  Router.get('/', function(req, res, next){
    User.userDetails('Bob', function(err, data){
      res.json({user: data})
    })
  });

  return {path: '/user', router: Router}
};


//app.js

var injector = require('magnum-di')();
var express = require('express');
var Database = require('./Database');
var app = express()
var http = require('http');

//Register some dependencies.
injector.factory('Router', express.Router);
injector.service('Database', Database);

//Here we are letting the injector provide the database to our UserModel
//This will make it simple to mock in our unit tests.
var User = injector.inject(require('./UserModel'));
injector.service('User', User);

var userRoute = injector.inject(require('./UserRoutes'));

app.use(userRoute.path, userRoute.router);

http.createServer(app).listen(8080);
```

### Mocking database for testing

Following our above example, we use magnum-di to mock out our Database object for testing.

Run this with `npm run example-test`

``` javascript

var injector = require('magnum-di');
var should = require('should');

//Our mock database object
injector.service('Database', {
  User: {
    users: {George: {name: 'George', age: 30}, Mike: {name: 'Mike', age: 20}},
    find: function(username, cb) {
     var user = (this.users[username]) ? this.users[username] : null
     cb(null, user);
    }
  }
});

//We now have a user model that is using our mock database.
var User = injector.inject(require('./UserModel'));

describe('Model being tested with a mock Database object', function() {

  it('should not have real data', function(done) {
    User.userDetails('Bob', function(err, data){
      should(data).be.null
      done()
    })
  });

  it('should have mock data', function(done) {
    User.userDetails('George', function(err, data){
      data.age.should.equal(30)
      done()
    })
  });

});

```

# API

<a name="MagnumDI"></a>
## MagnumDI
**Kind**: global class  

* [MagnumDI](#MagnumDI)
  * [new MagnumDI()](#new_MagnumDI_new)
  * [.service(name, item)](#MagnumDI#service) ⇒ <code>\*</code>
  * [.instance(name, fn)](#MagnumDI#instance) ⇒ <code>function</code>
  * [.factory(name, fn)](#MagnumDI#factory) ⇒ <code>function</code>
  * [.merge(name, merge)](#MagnumDI#merge) ⇒ <code>\*</code>
  * [.get(name)](#MagnumDI#get) ⇒ <code>\*</code> &#124; <code>null</code>
  * [.replace(name, replacement)](#MagnumDI#replace) ⇒ <code>Object</code>
  * [.unregister(name)](#MagnumDI#unregister) ⇒ <code>boolean</code>
  * [.inject(fn, thisArg)](#MagnumDI#inject) ⇒ <code>\*</code>

<a name="new_MagnumDI_new"></a>
### new MagnumDI()
Provides an instance of the Magnum DI injector.

<a name="MagnumDI#service"></a>
### magnumDI.service(name, item) ⇒ <code>\*</code>
Registers an object, string, number or function.

**Kind**: instance method of <code>[MagnumDI](#MagnumDI)</code>  
**Returns**: <code>\*</code> - Returns provided dependency  

| Param | Type | Description |
| --- | --- | --- |
| name | <code>string</code> | Name to be used in the injected function |
| item | <code>object</code> &#124; <code>array</code> &#124; <code>number</code> &#124; <code>string</code> &#124; <code>function</code> | Item to be injected. |

<a name="MagnumDI#instance"></a>
### magnumDI.instance(name, fn) ⇒ <code>function</code>
When injected, calls as a constructor with new.

**Kind**: instance method of <code>[MagnumDI](#MagnumDI)</code>  
**Returns**: <code>function</code> - Returns provided function  

| Param | Type | Description |
| --- | --- | --- |
| name | <code>string</code> | Name to be used in the injected function. |
| fn | <code>function</code> | Function to be called with new. |

<a name="MagnumDI#factory"></a>
### magnumDI.factory(name, fn) ⇒ <code>function</code>
When injected, calls the passed function. Returns the result of that call.

**Kind**: instance method of <code>[MagnumDI](#MagnumDI)</code>  
**Returns**: <code>function</code> - Retuens provided function.  

| Param | Type | Description |
| --- | --- | --- |
| name | <code>string</code> | Name to be used in the injected function |
| fn | <code>function</code> | Function to be called by injector. |

<a name="MagnumDI#merge"></a>
### magnumDI.merge(name, merge) ⇒ <code>\*</code>
Merges supplied object into the object registered for <name>, if <name> doesn't exist it will be created.

**Kind**: instance method of <code>[MagnumDI](#MagnumDI)</code>  
**Returns**: <code>\*</code> - Returns provided dependency  

| Param | Type | Description |
| --- | --- | --- |
| name | <code>String</code> | Dependency object to modify |
| merge | <code>Object</code> | Object to merge with existing dependency |

<a name="MagnumDI#get"></a>
### magnumDI.get(name) ⇒ <code>\*</code> &#124; <code>null</code>
Returns the specified dependency.

**Kind**: instance method of <code>[MagnumDI](#MagnumDI)</code>  
**Returns**: <code>\*</code> &#124; <code>null</code> - The named dependency item, or null.  

| Param | Type | Description |
| --- | --- | --- |
| name | <code>string</code> | Dependency to retrieve. |

<a name="MagnumDI#replace"></a>
### magnumDI.replace(name, replacement) ⇒ <code>Object</code>
Modifies a registered service object.

**Kind**: instance method of <code>[MagnumDI](#MagnumDI)</code>  
**Returns**: <code>Object</code> - Replaced dependency  

| Param | Type | Description |
| --- | --- | --- |
| name | <code>String</code> | Dependency object to modify. |
| replacement | <code>Object</code> | Object to replace current registered object. |

<a name="MagnumDI#unregister"></a>
### magnumDI.unregister(name) ⇒ <code>boolean</code>
Removes the specified dependency.

**Kind**: instance method of <code>[MagnumDI](#MagnumDI)</code>  
**Returns**: <code>boolean</code> - The result of the operation.  

| Param | Type | Description |
| --- | --- | --- |
| name | <code>string</code> | Registered dependency to remove. |

<a name="MagnumDI#inject"></a>
### magnumDI.inject(fn, thisArg) ⇒ <code>\*</code>
Runs the given function with args injected and with an optional context object.

**Kind**: instance method of <code>[MagnumDI](#MagnumDI)</code>  
**Returns**: <code>\*</code> - Returns the result of the called function.  

| Param | Type | Description |
| --- | --- | --- |
| fn | <code>function</code> | function to inject args into and run. |
| thisArg | <code>object</code> | Calling context. |




# Contributing

## Check out, add, document, test.

Run tests with `npm test`.
Regenerate this Readme with `npm run readme`


## licence

[MIT](LICENSE)

[npm-image]: https://img.shields.io/npm/v/magnum-di.svg
[npm-url]: https://www.npmjs.com/package/magnum-di
[travis-image]: https://api.travis-ci.org/PaperElectron/Magnum-DI.svg
[travis-url]: https://travis-ci.org/PaperElectron/Magnum-DI
[coveralls-image]: https://coveralls.io/repos/github/PaperElectron/Magnum-DI/badge.svg?branch=master
[coveralls-url]: https://coveralls.io/github/PaperElectron/Magnum-DI