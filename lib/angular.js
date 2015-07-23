var angular = global.angular || require('angular');
var storex = require('./');

var module = angular.module('storex', []);

module.provider('storex', StorexProvider);

function StorexProvider() {
  this.$get = function StorexFactory() {
    return storex;
  };
}

module.exports = angular;
