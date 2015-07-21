import Emitter from './emitter';
import util from './util';

class Store extends Emitter {

  constructor(methods) {
    super();

    this._pendingPromises = 0;

    const keys = Object.keys(methods);
    if (keys.length === 0) {
      throw new Error('The Store needs at least 1 method');
    }

    keys
      .filter(key => typeof methods[key] === 'function')
      .forEach(key => {
        this[key] = this._method.bind(this, key);
        this[util.wrapName(key)] = methods[key];
      });

    this._init();
  }

  listen(handler) {
    super.listen(handler);
    if (this._pendingPromises === 0) {
      handler(util.cloneState(this.state));
    }
  }

  _init() {
    const init = this[util.wrapName('init')] || util.noop;
    const result = init();
    this._handleResult(result);
  }

  _method(method, ...args) {
    const context = {
      state: util.cloneState(this.state)
    };
    const result = this[util.wrapName(method)].call(context, ...args);
    this._handleResult(result);
  }

  _handleResult(result) {
    if (!util.isPromise(result)) {
      this.state = result || [];
      if (this._pendingPromises === 0) {
        this.emit(null, util.cloneState(this.state));
      }
      return;
    }

    this._pendingPromises = this._pendingPromises + 1;

    result.then(result => {
      this._pendingPromises = this._pendingPromises - 1;
      this.state = result;
      this.emit(null, util.cloneState(this.state));
    }, error => {
      this._pendingPromises = this._pendingPromises - 1;
      this.emit(error);
    });
  }

}

export default Store;
