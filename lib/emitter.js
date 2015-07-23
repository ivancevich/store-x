import {EventEmitter} from 'events';
import util from './util';

const LISTEN = util.wrapName('listen');

class Emitter extends EventEmitter {

  constructor() {
    super();
  }

  emit(event, err, state) {
    if (err) {
      super.emit(LISTEN, err);
      super.emit(event, err);
      return;
    }
    super.emit(LISTEN, null, state);
    super.emit(event, null, state);
  }

  listen(event, handler) {
    if (typeof event === 'function') {
      handler = event;
      event = undefined;
    }
    this.on(event || LISTEN, handler);
  }

}

export default Emitter;
