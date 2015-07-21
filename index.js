import Store from './lib/store';
let stores = [];

function createStore (methods) {
  let store = new Store(methods);
  stores.push(store);
  return store;
}

export default createStore;
