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

  store.listen(function (state) {
    t.deepEqual(state, data);
    t.end();
  });
});

test('should create store with custom method', function (t) {
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
    create: function (data) {
      var state = this.state;
      return request.post(base + path, data).then(function (result) {
        state.push(result.data);
        return state;
      });
    }
  });

  var count = 0;
  store.listen(function (state) {
    var expected;

    switch (++count) {
      case 1:
        expected = [];
        break;
      case 2:
        expected = [data];
        break;
    }

    t.deepEqual(state, expected);
  });

  store.create(data);

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

  store.error(function (err) {
    t.deepEqual(err, error);
    t.end();
  });
});
