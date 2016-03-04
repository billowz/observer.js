const observer = require('../index');

describe("Observer Performance", () => {
  let obj_nr = 100,
    prop_nr = 5;

  function generate() {
    let objs = [], i, j, o,
      start = new Date(), ms;

    for (let i = 0; i < obj_nr; i++) {
      o = {};
      for (j = 0; j < prop_nr; j++) {
        o['key' + j] = j;
      }
      objs.push(o);
    }
    ms = new Date() - start;
    console.log(this.test.fullTitle() + ': generate data ' + objs.length + ' use:' + ms + ' ms');
    return objs;
  }
  function cleanBinding(objs) {
    let start = new Date(), ms;

    for (let i = 0; i < objs.length; i++) {
      objs[i] = observer.un(objs[i]);

    }
    objs = observer.un(objs);

    ms = new Date() - start;
    console.log(this.test.fullTitle() + ': clean binding ' + objs.length + ' use:' + ms + ' ms');
  }

  function checkBinding(objs, binded) {
    let start = new Date(), ms;

    for (let i = 0; i < objs.length; i++) {
      expect(observer.hasListen(objs[i])).equal(binded);
    }
    expect(observer.hasListen(objs)).equal(binded);
    ms = new Date() - start;
    console.log(this.test.fullTitle() + ': check binding ' + objs.length + ' use:' + ms + ' ms');
  }

  function binding(objs, handler, allhandler) {
    let start = new Date(), ms,
      every = handler instanceof Array;

    for (let i = 0; i < objs.length; i++) {
      objs[i] = observer.on(objs[i], every ? handler[i] : handler);
    }
    observer.on(objs, 'length', allhandler);
    ms = new Date() - start;
    console.log(this.test.fullTitle() + ': binding ' + objs.length + ' use:' + ms + ' ms');
  }

  describe('Observer.on', () => {
    let objs;

    beforeEach(function() {
      this.timeout(0);
      objs = generate.call(this);
    });

    afterEach(function() {
      this.timeout(0);
      cleanBinding.call(this, objs);
      objs = [];
    });

    it("run", function() {
      this.timeout(0);
      binding(objs, function() {}, function() {});
    });
  });
  describe('Observer.un', () => {
    let objs;

    beforeEach(function() {
      this.timeout(0);
      objs = generate.call(this);
      binding(objs, function() {}, function() {});
    });

    afterEach(function() {
      objs = [];
    });

    it("run", function() {
      this.timeout(0);
      cleanBinding.call(this, objs);
    });
  });
  describe('Observer.hasListen:true', () => {
    let objs;

    beforeEach(function() {
      this.timeout(0);
      objs = generate.call(this);
      binding(objs, function() {}, function() {});
    });

    afterEach(function() {
      this.timeout(0);
      cleanBinding.call(this, objs);
      objs = [];
    });

    it("run", function() {
      this.timeout(0);
      checkBinding.call(this, objs, true);
    });
  });
  describe('Observer.hasListen:false', () => {
    let objs;

    beforeEach(function() {
      this.timeout(0);
      objs = generate.call(this);
    });

    afterEach(function() {
      objs = [];
    });

    it("run", function() {
      this.timeout(0);
      checkBinding.call(this, objs, false);
    });
  });
});
