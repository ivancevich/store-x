# store-x

> Universal Flux Stores

## Install
`npm install store-x --save`

## Using it with jQuery
```js
var $ = require('jquery');
var storex = require('store-x');

// Create a store
var peopleStore = storex({
  init: function () {
    return $.get('https://api.mysite.com/people');
  },
  create: function (person) {
    var state = this.state;
    return $.post('https://api.mysite.com/people', person).then(function (person) {
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
```
