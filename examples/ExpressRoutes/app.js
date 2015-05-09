/**
 * @file app
 * @author Jim Bulkowski <jim.b@paperelectron.com>
 * @project magnum-di
 * @license MIT {@link http://opensource.org/licenses/MIT}
 */

var injector = require('../../index');
var express = require('express');
var Database = require('../common/Database');
var app = express()
var http = require('http');

//Register some dependencies.
injector.factory('Router', express.Router);
injector.service('Database', Database);

//Here we are letting the injector provide the database to our UserModel
//This will make it simple to mock in our unit tests.
var User = injector.inject(require('../common/UserModel'));
injector.service('User', User);

var userRoute = injector.inject(require('./UserRoutes'));

app.use(userRoute.path, userRoute.router);

http.createServer(app).listen(8080, function(){
  console.log('Server running on port 8080');
});

