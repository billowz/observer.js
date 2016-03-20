if (!window.console) {
  let el;

  function init() {
    if (!el) {
      el = document.getElementById('__console__');
    }
    if (!el) {
      el = document.createElement('div');
      el.innerHTML = ['<div id = "__console__" ',
        'style = "position:absolute; top:0; right:0; width:', document.body.clientWidth * 0.7, '; border:1px solid #999;',
        'font-family:courier,monospace; background:#eee; font-size:10px; padding:10px;">',
        '<a style = "float:right; padding-left:1em; padding-bottom:.5em; text-align:right;" ',
        'href="javascript:console.hide()">Close</a>',
        '<a style = "float:right; padding-left:1em; padding-bottom:.5em; text-align:right;" ',
        'href="javascript:console.clear()">Clear</a>',
        '</div>'].join('');

      document.body.appendChild(el);
      el = document.getElementById('__console__');
      console.hide();
    }
  }

  window.console = {

    hide: function() {
      el.style.display = 'none';
    },
    show: function() {
      el.style.display = 'block';
    },
    log: function(o) {
      el.innerHTML += '<br/>' + o;
      console.show();
    },
    clear: function() {
      el.parentNode.removeChild(el);
      el = undefined;
      init();
      console.show();
    }
  }

  if (typeof window.onload != 'function') {
    window.onload = init;
  } else {
    let loadBefore = window.onload;
    window.onload = function() {
      loadBefore();
      init();
    }
  }
}



class AsyncDone {

  constructor(done, onDone) {
    this.done = done;
    this.onDone = onDone;
    this.__async = 0;
  }
  async() {
    this.__async++;
    return () => {
      this.__async--;
      if (!this.__async) {
        if (this.onDone) {
          this.onDone();
        }
        this.done();
      }
    };
  }
}
window.AsyncDone = AsyncDone;
