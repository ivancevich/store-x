'use strict';
require('babel/register');

var test = require('tape');
var nock = require('nock');
var request = require('axios');
var storex = require('../');

test('should not create an empty store', function (t) {
  t.throws(storex, 'The Store needs at least 1 method');
  t.end();
});

test('should create store with init method', function (t) {
  var base = 'http://localhost:3000';
  var path = '/posts';
  var data = [{
    id: 1,
    title: 'First blog post',
    author: 'JC Ivancevich'
  }];

  var mock = nock(base).get(path).reply(200, data);

  var store = storex({
    init: function () {
      return request.get(base + path).then(function (result) {
        return result.data;
      });
    }
  });

  store.listen(function (err, state) {
    t.equal(err, null);
    t.deepEqual(state, data);
    t.end();
  });
});

test('should create store with custom method', function (t) {
  t.plan(4);

  var base = 'http://localhost:3000';
  var path = '/posts';
  var data = {
    id: 2,
    title: 'Universal Flux Store',
    author: 'JC Ivancevich'
  };

  var mock = nock(base).post(path).reply(200, data);

  var store = storex({
    create: function (data) {
      var state = this.state;
      return request.post(base + path, data).then(function (result) {
        state.push(result.data);
        return state;
      });
    }
  });

  var count = 0;
  store.listen(function (err, state) {
    var expected;

    switch (++count) {
      case 1:
        expected = [];
        break;
      case 2:
        expected = [data];
        break;
    }

    t.equal(err, null);
    t.deepEqual(state, expected);
  });

  store.create(data);

});

test('should fire custom events', function (t) {
  t.plan(2);

  var base = 'http://localhost:3000';
  var path = '/posts';
  var data = {
    id: 2,
    title: 'Universal Flux Store',
    author: 'JC Ivancevich'
  };

  var mock = nock(base).post(path).reply(200, data);

  var store = storex({
    init: function () {
      return [1, 2, 3];
    },
    add: function (numbers) {
      var state = this.state;
      return state.concat(numbers);
    }
  });

  store.listen('init', function (err, state) {
    t.equal(err, null);
    t.deepEqual(state, [1, 2, 3]);
  });

  store.listen('add', function (err, state) {
    t.equal(err, null);
    t.deepEqual(state, [1, 2, 3, 4, 5, 6]);
  });

  store.add([4, 5, 6]);

});

test('should fire error on ajax error', function (t) {
  var base = 'http://localhost:3000';
  var path = '/posts';
  var error = {
    message: 'Something unexpected happened',
    code: 'ERROR_FOO'
  };

  var mock = nock(base).get(path).replyWithError(error);

  var store = storex({
    init: function () {
      return request.get(base + path).then(function (result) {
        return result.data;
      });
    }
  });

  store.listen(function (err, state) {
    t.deepEqual(err, error);
    t.equal(state, undefined);
    t.end();
  });
});

test('should make store methods return its result', function (t) {
  t.plan(4);

  var _state = {
    foo: 'bar'
  };

  var store = storex({
    foo: function () {
      return _state;
    }
  });

  store.listen('foo', function (err, state) {
    t.equal(err, null);
    t.deepEqual(state, _state);
  });

  var result = store.foo();
  t.deepEqual(result, _state);

  // changing the result should not mutate the state
  result.foo = 'baz';
  t.notDeepEqual(store.state, result);
});

test('should make store methods return its result as promise', function (t) {
  t.plan(4);
  var base = 'http://localhost:3000';
  var path = '/posts';
  var data = [{
    id: 1,
    title: 'First blog post',
    author: 'JC Ivancevich'
  }];

  var mock = nock(base).get(path).reply(200, data);

  var store = storex({
    fooPromise: function () {
      return request.get(base + path).then(function (result) {
        return result.data;
      });
    }
  });

  store.listen('fooPromise', function (err, state) {
    t.equal(err, null);
    t.deepEqual(state, data);
  });

  var promise = store.fooPromise();
  promise.then(function (result) {
    t.deepEqual(result, data);

    // changing the result should not mutate the state
    result[0].foo = 'bar';
    t.notDeepEqual(store.state, result);
  });
});
