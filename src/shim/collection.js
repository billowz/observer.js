/**
 * Map & Set & WeakMap & WeakSet
 */

import './es5'

if (!window.Map) {
  let ITERATOR_TYPE = {
      KEY: 'key',
      VALUE: 'value',
      ENTRY: 'entry'
    },
    HASH_BIND = '__hash__',
    objHashIdx = 0;
  function hash(value) {
    return (typeof value) + ' ' + ((value && (typeof value == 'object' || typeof value == 'function')) ?
        (value[HASH_BIND] || (value[HASH_BIND] = ++objHashIdx)) : value + '');
  }

  class Map {

    constructor() {
      this._map = {};
      this._keyMap = {};
      this._size = 0;
    }

    has(key) {
      return hash(key) in this._keyMap;
    }

    get(key) {
      let hcode = hash(key);
      if (hcode in this._keyMap) {
        return this._map[hcode];
      }
      return undefined;
    }

    set(key, val) {
      let hcode = hash(key);
      this._keyMap[hcode] = key;
      this._map[hcode] = val;
      if (!(hcode in this._keyMap)) {
        this._size++;
      }
      return this;
    }

    delete(key) {
      let hcode = hash(key);
      if (hcode in this._keyMap) {
        delete this._keyMap[hcode];
        delete this._map[hcode];
        this._size--;
        return true;
      }
      return false;
    }

    size() {
      return this._size;
    }

    clear() {
      this._keyMap = {};
      this._map = {};
      this._size = 0;
    }

    forEach(callback) {
      for (let key in this._map) {
        if (key in this._keyMap)
          callback(this._map[key], key, this);
      }
    }
    keys() {
      return new MapIterator(this, ITERATOR_TYPE.KEY);
    }
    values() {
      return new MapIterator(this, ITERATOR_TYPE.VALUE);
    }
    entries() {
      return new MapIterator(this, ITERATOR_TYPE.ENTRY);
    }
    toString() {
      return '[Object Map]';
    }
  }

  class MapIterator {
    constructor(map, type) {
      this._index = 0;
      this._map = map;
      this._type = type;
    }
    next() {
      if (!this._hashs) {
        this._hashs = Object.keys(this._map._map);
      }
      let val = undefined;
      if (this._index < this._hashs.length) {
        let hash = this._hashs[this.index++];
        switch (this._type) {
          case ITERATOR_TYPE.KEY:
            val = this._map._keyMap[hash];
          case ITERATOR_TYPE.VALUE:
            val = this._map._map[hash];
          case ITERATOR_TYPE.ENTRY:
            val = [this._map._keyMap[hash], this._map._map[hash]];
          default:
            throw new TypeError('Invalid iterator type');
        }
      }
      return {
        value: val,
        done: this._index >= this._keys.length
      }
    }
    toString() {
      return '[object Map Iterator]';
    }
  }

  window.Map = Map;
}
