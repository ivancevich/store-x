import Store from './lib/store';

function storex (methods) {
  return new Store(methods);
}

export default storex;
