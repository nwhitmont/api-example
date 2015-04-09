
var Hapi = require('hapi');
var Joi = require('joi');

var tests = [
{
   id: 'homepage_win7_chrome38',
   name: 'homepage',
   browser: 'chrome',
   browser_version: '38.0',
   os: 'Windows',
   os_version: '7'
 },
 {
  id: 'homepage_win7_ff33',
   name: 'homepage',
   browser: 'firefox',
   browser_version: '33.0',
   os: 'Windows',
   os_version: '7'
 },
 {
  id:'homepage_win7_ie10',
 name: 'homepage',
 browser: 'ie',
 browser_version: '10',
 os: 'Windows',
 os_version: '7'
},
{
  id: 'homepage_win7_ie11',
 name: 'homepage',
 browser: 'ie',
 browser_version: '11',
 os: 'Windows',
 os_version: '7'
}
];



var server = new Hapi.Server();
server.connection({ port: 3000 });


var testController = {};

testController.getConfig = {
 handler: function(req, reply) {
   if (req.params.id) {
     if (tests.length <= req.params.id) return reply('No quote found.').code(404);
     return reply(tests[req.params.id]);
   }
   reply(tests);
 }
};

testController.getRandomConfig = {
 handler: function(req, reply) {
   var id = Math.floor(Math.random() * tests.length);
   reply(tests[id]);
 }
};

testController.getAllConfigs = {
 handler: function(req, reply) {
   reply(tests);
 }
};

testController.postConfig = {
 handler: function(req, reply) {
   var newQuote = { author: req.payload.author, text: req.payload.text };
   tests.push(newQuote);
   reply(newQuote);
 },
 validate: {
   payload: {
     name: Joi.string().required(),
     browser: Joi.string().required(),
     browser_version: Joi.string().required(),
     os: Joi.string().required(),
     os_version: Joi.string().required()
   }
 }
};


var routes = [
 { path: '/test/{id?}', method: 'GET', config: testController.getConfig },
 { path: '/random', method: 'GET', config: testController.getRandomConfig },
 { path: '/tests', method: 'GET', config: testController.getAllConfigs },
 { path: '/test', method: 'POST', config: testController.postConfig }
];

server.route(routes);

server.start(function () {
   console.log('Server running at:', server.info.uri);
});
