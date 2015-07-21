import emitter from 'contra/emitter';

class Emitter {

  constructor() {
    this.emitter = emitter();
  }

  emit(err, data) {
    if (err) {
      this.emitter.emit('error', err);
    } else {
      this.emitter.emit('change', data);
    }
  }

  listen(handler) {
    this.emitter.on('change', handler);
    return this.emitter;
  }

  error(handler) {
    this.emitter.on('error', handler);
    return this.emitter;
  }

}

export default Emitter;
