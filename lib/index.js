import Store from './store';

function storex (methods) {
  return new Store(methods);
}

export default storex;
