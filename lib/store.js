import Emitter from './emitter';
import util from './util';

class Store extends Emitter {

  constructor(methods) {
    super();

    this._pendingPromises = 0;

    const keys = Object.keys(methods);
    if (keys.length === 0) {
      throw new Error('the store needs at least 1 method');
    }

    keys
      .filter(key => typeof methods[key] === 'function')
      .forEach(key => {
        this[key] = this._method.bind(this, key);
        this[util.wrapName(key)] = methods[key];
      });

    this._init();
  }

  get state() {
    return util.clone(this._state);
  }

  listen(event, handler) {
    super.listen(event, handler);

    if (typeof event === 'string') {
      return;
    }

    handler = event;
    event = undefined;
    if (this._pendingPromises === 0) {
      handler(null, this.state);
    }
  }

  _init() {
    const event = 'init';
    const init = this[util.wrapName(event)] || util.noop;
    const result = init();
    this._handleResult(event, result);
  }

  _method(method, ...args) {
    const context = {
      state: this.state
    };
    let result = this[util.wrapName(method)].call(context, ...args);
    this._handleResult(method, result);
    return result;
  }

  _handleResult(method, result) {
    if (!util.isPromise(result)) {
      this._state = util.clone(result || []);
      if (this._pendingPromises === 0) {
        this.emit(method, null, this.state);
      }
      return;
    }

    this._pendingPromises = this._pendingPromises + 1;

    result.then(result => {
      this._pendingPromises = this._pendingPromises - 1;
      this._state = util.clone(result);
      this.emit(method, null, this.state);
    }, err => {
      this._pendingPromises = this._pendingPromises - 1;
      this.emit(method, err);
    });
  }

}

export default Store;
