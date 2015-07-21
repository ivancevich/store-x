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
  }

  error(handler) {
    this.emitter.on('error', handler);
  }

}

export default Emitter;
