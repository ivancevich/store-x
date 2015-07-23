import clone from 'lodash/lang/cloneDeep';

export default {
  noop,
  clone,
  wrapName,
  isPromise
};

function wrapName(name) {
  return '$' + name + '$';
}

function isPromise(obj) {
  return !!obj && (typeof obj === 'object' || typeof obj === 'function') &&
    typeof obj.then === 'function';
}

function noop() {}
