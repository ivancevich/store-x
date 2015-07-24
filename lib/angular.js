var angular = global.angular || require('angular');
var storex = require('./');

var ngModule = angular.module('storex', []);

ngModule.provider('storex', StorexProvider);

function StorexProvider() {
  this.$get = function StorexFactory() {
    return storex;
  };
}

module.exports = angular;
