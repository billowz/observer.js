const observer = require('../index');
require('./test');

describe("Observer Performance", () => {
  let obj_nr = 200,
    prop_nr = 4;

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
      if (observer.hasListen(objs[i]) !== binded) {
        expect().fail();
      }
    }
    ms = new Date() - start;
    console.log(this.test.fullTitle() + ': check binding ' + objs.length + ' use:' + ms + ' ms');
    if (observer.hasListen(objs) !== binded) {
      expect().fail();
    }
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
      binding.call(this, objs, function() {}, function() {});
    });
  });

  describe('Observer event', () => {
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

    it("run", function(done) {
      let start = new Date(), ms,
        __i__ = 0,
        test = this.test;

      this.timeout(0);
      binding.call(this, objs, function() {
        if (++__i__ === objs.length * prop_nr) {
          ms = new Date() - start;
          console.log(test.fullTitle() + ': fire ' + __i__ + ' events use:' + ms + ' ms');
          done();
        }
      }, function() {});
      start = new Date();
      for (let i = 0; i < objs.length; i++) {
        for (let j = 0; j < prop_nr; j++) {
          objs[i]['key' + j] = 'T-' + i + '-' + j;
        }
      }
    });
  });

  describe('Observer.un', () => {
    let objs;

    beforeEach(function() {
      this.timeout(0);
      objs = generate.call(this);
      binding.call(this, objs, function() {}, function() {});
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
      binding.call(this, objs, function() {}, function() {});
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
