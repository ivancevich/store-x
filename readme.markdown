# store-x

> Universal Flux Stores

Simple yet powerful [Flux](http://facebook.github.io/flux/) store + dispatcher implementation. It's meant to work with any JS framework or library, and on the server as well.

You can use it with any module system:

- Globals:
```js
var myStore = window.storex({
  method: function () {
    return [];
  }
});
```

- ES6 / ES2015
```js
import storex from 'store-x';

var myStore = storex({
  method: function () {
    return [];
  }
});

export default myStore;
```

- CommonJS
```js
var storex = require('store-x');

var myStore = storex({
  method: function () {
    return [];
  }
});

module.exports = myStore;
```

- AMD
```js
define(['store-x'], function (storex) {

  var myStore = storex({
    method: function () {
      return [];
    }
  });

  return myStore;
});
```


## Install

You can get it from NPM:

`npm install store-x --save`

Or from Bower:

`bower install store-x --save`


## Using it with Angular.js
> You need to include: `store-x/dist/store-x.angular.js` or `store-x/dist/store-x.angular.min.js`

```js
var myApp = angular.module('myApp', ['storex']);

myApp.factory('PeopleStore', ['storex', '$http', function (storex, $http) {
  var api = 'https://api.mysite.com/people';
  return storex({
    init: function () {
      return $http.get(api).then(function (response) {
        return response.data;
      });
    },
    create: function (person) {
      var state = this.state;
      return $http.post(api, person).then(function (response) {
        state.push(response.data);
        return state;
      });
    }
  });
}]);

myApp.controller('PeopleController', ['$scope', 'PeopleStore', function ($scope, PeopleStore) {
  $scope.people = [];
  $scope.form = {};

  PeopleStore.listen(function (err, state) {
    if (err) {
      // handle the error
      return;
    }
    $scope.people = state;
  });

  $scope.create = function create() {
    var person = {
      first_name: $scope.form.first_name,
      last_name: $scope.form.last_name
    };
    PeopleStore.create(person);
    $scope.form = {};
  }
}]);
```


## Using it with jQuery
> You need to include: `store-x/dist/store-x.js` or `store-x/dist/store-x.min.js`

```js
$(function () {

  var api = 'https://api.mysite.com/people';

  // Create a store
  var peopleStore = storex({
    init: function () {
      return $.get(api);
    },
    create: function (person) {
      var state = this.state;
      return $.post(api, person).then(function (person) {
        state.push(person);
        return state;
      });
    }
  });

  // Listen to all events
  peopleStore.listen(function (err, state) {
    if (err) {
      console.error('Danger danger!');
    }
    console.log(state);
  });

  // Listen to the `init` event
  peopleStore.listen('init', function (err, state) {
    if (err) {
      console.error('Danger danger!');
    }
    console.log(state);
  });

  // Listen to the `create` event
  peopleStore.listen('create', function (err, state) {
    if (err) {
      console.error('Danger danger!');
    }
    console.log(state);
  });

  // Execute an action
  $('.btn').click(function (event) {
    peopleStore.create({
      first_name: 'JC',
      last_name: 'Ivancevich'
    });
  });

});
```
