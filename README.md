[![Build](https://api.travis-ci.org/tao-zeng/observer.js.svg?branch=master)](https://travis-ci.org/tao-zeng/observer.js)
[![codecov.io](https://codecov.io/github/tao-zeng/observer.js/coverage.svg?branch=master)](https://codecov.io/github/tao-zeng/observer.js?branch=master)
[![Version](https://img.shields.io/npm/v/observer.js.svg)](https://npmjs.org/package/observer.js)
[![License](https://img.shields.io/npm/l/observer.js.svg)](https://npmjs.org/package/observer.js)
[![Downloads](https://img.shields.io/npm/dt/observer.js.svg)](https://npmjs.org/package/observer.js)
[![Sauce Test Status](https://saucelabs.com/browser-matrix/observer_js.svg)](https://saucelabs.com/u/observer_js)

##observer.js

用于观察任意对象的任意变化的类库。
支持 ES7 Object.observe, IE 6 7 8


### 对象字面量
```javascript
var obj = { a: 1 };
observer.on(obj, function (name, value , old) {
    console.log(name + "__" + value + "__" + old);
});
obj.a = 2; //a__2__1 
```

### 数组
```javascript
var arr = [1, 2, 3];
observer.on(arr, function(name, value, old) {
    console.log(name + "__" + value + "__" + old);
});
arr.push(4); //Array-push__[1,2,3,4]__[1,2,3]
arr[2] = 5; //2__5__3   length__4__3
```

### 复杂对象
```javascript
var complexObj = {
    a: 1,
    b: 2,
    c: [{
        d: [4]
    }]
};
observer.on(complexObj, 'c[0].d', function(name, value, old) {
    console.log(name + "__" + value + "__" + old); 
});
complexObj.c[0].d = 100; //c[0].d__100__4
```
### 普通对象
```javascript
var User = function(name, age) {
    this.name = name;
    this.age = age;
    //只监听name
    observer.on(this, ["name"], function(name, value, oldValue) {
        console.log(name + "__" + value + "__" + oldValue);
    });
}
var user = new User("lisi", 25);
user.name = "wangwu"; //name__wangwu__lisi
user.age = 20; //nothing，no listener
```


This content is released under the (http://opensource.org/licenses/MIT) MIT License.
