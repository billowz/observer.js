[![Build Status](https://api.travis-ci.org/tao-zeng/observer.js.svg?branch=master)](https://travis-ci.org/tao-zeng/observer.js) 
[![Join the chat at https://gitter.im/tao-zeng/observer.js](https://badges.gitter.im/Join%20Chat.svg)](https://gitter.im/tao-zeng/observer.js?utm_source=badge&utm_medium=badge&utm_campaign=pr-badge&utm_content=badge)
[![Issue Stats](http://issuestats.com/github/tao-zeng/observer.js/badge/pr)](http://issuestats.com/github/tao-zeng/observer.js)
[![Issue Stats](http://issuestats.com/github/tao-zeng/observer.js/badge/issue)](http://issuestats.com/github/tao-zeng/observer.js)
[![npm version](https://badge.fury.io/js/angular2.svg)](http://badge.fury.io/js/angular2)
[![Downloads](http://img.shields.io/npm/dm/angular2.svg)](https://npmjs.org/package/angular2)
[![Sauce Test Status](https://saucelabs.com/browser-matrix/angular2-ci.svg)](https://saucelabs.com/u/angular2-ci)

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
