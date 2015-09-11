function fixFn(Type, name, _name) {
  if (!Type[name]) {
    Type[name] = typeof _name === 'function' ? _name : function() {
      return _[_name || name].apply(_, arguments);
    }
  }
}
function fixProtoFn(Type, name, _name) {
  Type = Type.prototype;
  if (!Type[name]) {
    Type[name] = typeof _name === 'function' ? _name : function() {
      return _[_name || name].apply(_, [this].concat(_.slice(arguments)));
    }
  }
}

fixFn(Object, 'create');

fixProtoFn(Function, 'bind');

fixProtoFn(Array, 'forEach', 'each');

fixProtoFn(Array, 'indexOf');
