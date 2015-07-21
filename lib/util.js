import _ from 'lodash/lang';

export default {
  noop,
  wrapName,
  isPromise,
  cloneState
};

function wrapName(name) {
  return '$' + name + '$';
}

function isPromise(obj) {
  return !!obj && (typeof obj === 'object' || typeof obj === 'function') &&
    typeof obj.then === 'function';
}

function cloneState(state) {
  return _.cloneDeep(state);
}

function noop() {}
