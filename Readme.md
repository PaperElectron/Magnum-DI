# Magnum DI

## A super simple Key,Value Dependency Injection framework for NodeJS

```shell
npm install --save magnum-di
```

```javascript
//Load it up./
var injector = require('magnum-di')

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
returned by the require call.

``` javascript

//userRoutes.js
module.exports = function(Router, User) {
  //Router and User here will be injected.

  Router.get('/', function(req, res, next){
    User.userDetails('Bob', function(err, data){
      res.json({user: data})
    })
  })
  return {path: '/user', router: Router}
}


//app.js
var injector = require('magnum-di');
var express = require('express');
var Database = require('./Database);
var User = require('./UserModel);
var app = express()

//Register some dependencies.
injector.factory('Router', express.Router)
injector.service('User', User)

var userRoute = injector.inject(require('./user_routes'))

app.use(userRoute.path, userRoute.router)
```

# API

<a name="module_injector"></a>
## injector
Magnum DI framework.


* [injector](#module_injector)
  * [.factory(name, fn)](#module_injector.factory)
  * [.instance(name, fn)](#module_injector.instance)
  * [.service(name, item)](#module_injector.service)
  * [.inject(fn, thisArg)](#module_injector.inject) ⇒ <code>\*</code>
  * [.get(name)](#module_injector.get) ⇒ <code>\*</code>
  * [.unregister(name)](#module_injector.unregister)

<a name="module_injector.factory"></a>
### injector.factory(name, fn)
When injected, calls the passed function. Returns the result of that call.

**Kind**: static method of <code>[injector](#module_injector)</code>  

| Param | Type | Description |
| --- | --- | --- |
| name | <code>string</code> | Name to be used in the injected function |
| fn | <code>function</code> | Function to be called by injector. |

<a name="module_injector.instance"></a>
### injector.instance(name, fn)
When injected, calls as a constructor with new.

**Kind**: static method of <code>[injector](#module_injector)</code>  

| Param | Type | Description |
| --- | --- | --- |
| name | <code>string</code> | Name to be used in the injected function. |
| fn | <code>function</code> | Function to be called with new. |

<a name="module_injector.service"></a>
### injector.service(name, item)
Registers an object, string, number. Anything but a function.

**Kind**: static method of <code>[injector](#module_injector)</code>  

| Param | Type | Description |
| --- | --- | --- |
| name | <code>string</code> | Name to be used in the injected function |
| item | <code>object</code> &#124; <code>array</code> &#124; <code>number</code> &#124; <code>string</code> | Item to be injected. |

<a name="module_injector.inject"></a>
### injector.inject(fn, thisArg) ⇒ <code>\*</code>
Runs the given function with args injected and with an optional context object.

**Kind**: static method of <code>[injector](#module_injector)</code>  

| Param | Type | Description |
| --- | --- | --- |
| fn | <code>function</code> | function to inject args into and run. |
| thisArg | <code>object</code> | Calling context. |

<a name="module_injector.get"></a>
### injector.get(name) ⇒ <code>\*</code>
Returns the specified dependency.

**Kind**: static method of <code>[injector](#module_injector)</code>  
**Returns**: <code>\*</code> - The asked for dependency item.  

| Param | Type | Description |
| --- | --- | --- |
| name | <code>string</code> | Dependency to retrieve. |

<a name="module_injector.unregister"></a>
### injector.unregister(name)
Removes the specified dependency.

**Kind**: static method of <code>[injector](#module_injector)</code>  

| Param | Type |
| --- | --- |
| name | <code>string</code> | 




#Contributing

## Check out, add, document, test.

Run tests with `npm test`.
Regenerate this Readme with `npm run readme`


##licence

[MIT](LICENSE)