# store-x

> Universal Flux Stores

[![Build Status](https://travis-ci.org/ivancevich/store-x.svg?branch=master)](https://travis-ci.org/ivancevich/store-x)

Simple yet powerful [Flux](http://facebook.github.io/flux/) stores implementation. It's meant to work with any JS framework or library, and on the server as well.


## Install

You can get it from NPM:

`npm install store-x --save`

Or from Bower:

`bower install store-x --save`


## Usage

### You can use it with any module system

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
  method () {
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

### API

The `store-x`'s API is very simple. You just need to give it an object with methods. Then, you'll be able to call those methods, and listen to events when the state changes.

There's a method to initialize the store's state, which is the `init` method. This one is going to be executed automatically as soon as the store is created.

```js
// in this case we initialize the
// store's state with an empty array.
var myStore = store({
  init: function () {
    return [];
  }
});
```

Store methods can return anything. The returned value will replace the store's state. You can even return promises and `store-x` will replace the state with the result of the promise. It works not only with jQuery promises, but with any Promises/A+ implementation.

```js
// in this case we initialize the
// store's state with the result of
// calling an API with jQuery.
var myStore = store({
  init: function () {
    return $.ajax({
      url: 'https://api.mysite.com/people',
      method: 'GET'
    });
  }
});
```

You can listen to events which will be fired whenever the store's state changes.

```js
var myStore = store({
  init: function () {
    return $.ajax({
      url: 'https://api.mysite.com/people',
      method: 'GET'
    });
  },
  create: function (person) {
    var state = this.state;
    return $.ajax({
      url: 'https://api.mysite.com/people',
      method: 'POST',
      data: person
    }).then(function (person) {
      state.push(person);
      return state;
    });
  }
});

// in this case we listen to all events.
// notice that the handler will be called
// as soon as it's attached to the event if
// there aren't any pending promises.
myStore.listen(function (err, state) {
  if (err) {
    // handle error
    return;
  }
  console.log('this is the current state', state);
});

// you can also listen to specific events.
myStore.listen('init', function (err, state) {
  if (err) {
    // handle error
    return;
  }
  console.log('the store was just initialized');
});

myStore.listen('create', function (err, state) {
  if (err) {
    // handle error
    return;
  }
  console.log('a person was just created');
});

// here's how we can invoke a method.
myStore.create({
  first_name: 'John',
  last_name: 'Doe'
});
```


### Using it with Angular.js
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


### Using it with jQuery
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
      first_name: 'John',
      last_name: 'Doe'
    });
  });

});
```
