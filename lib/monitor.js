

var Monitoring = Monitoring || (function() {

    function MemoryStats() {

      var msMin = 100;
      var msMax = 0;

      var container = document.createElement('div');
      container.id = 'stats';
      container.style.cssText = 'width:106px;opacity:0.9;cursor:pointer';

      var msDiv = document.createElement('div');
      msDiv.id = 'ms';
      msDiv.style.cssText = 'padding:0 0 3px 3px;text-align:left;background-color:#020;';
      container.appendChild(msDiv);

      var msText = document.createElement('div');
      msText.id = 'msText';
      msText.style.cssText = 'color:#0f0;font-family:Helvetica,Arial,sans-serif;font-size:9px;font-weight:bold;line-height:15px';
      msText.innerHTML = 'Memory';
      msDiv.appendChild(msText);

      var msGraph = document.createElement('div');
      msGraph.id = 'msGraph';
      msGraph.style.cssText = 'position:relative;width:100px;height:30px;background-color:#0f0';
      msDiv.appendChild(msGraph);

      while (msGraph.children.length < 100) {
        var bar = document.createElement('span');
        bar.style.cssText = 'width:1px;height:30px;float:left;background-color:#131';
        msGraph.appendChild(bar);
      }

      var updateGraph = function(dom, height, color) {

        var child = dom.appendChild(dom.firstChild);
        child.style.height = height + 'px';
        if (color)
          child.style.backgroundColor = color;

      }

      var perf = window.performance || {};
      // polyfill usedJSHeapSize
      if (!perf && !perf.memory) {
        perf.memory = {
          totalJSHeapSize: 0,
          usedJSHeapSize: 0
        };
      }
      if (perf && !perf.memory) {
        perf.memory = {
          totalJSHeapSize: 0,
          usedJSHeapSize: 0
        };
      }

      // support of the API?
      if (perf.memory.totalJSHeapSize === 0) {
        console.warn('totalJSHeapSize === 0... performance.memory is only available in Chrome .')
        return {
          domElement: container,
          update: function() {}
        }
      }

      // TODO, add a sanity check to see if values are bucketed.
      // If so, reminde user to adopt the --enable-precise-memory-info flag.
      // open -a "/Applications/Google Chrome.app" --args --enable-precise-memory-info

      var lastTime = new Date();
      var lastUsedHeap = perf.memory.usedJSHeapSize;
      return {
        domElement: container,

        update: function() {

          // refresh only 30time per second
          if (new Date() - lastTime < 1000 / 30) return;
          lastTime = new Date()

          var delta = perf.memory.usedJSHeapSize - lastUsedHeap;
          lastUsedHeap = perf.memory.usedJSHeapSize;
          var color = delta < 0 ? '#830' : '#131';

          var ms = perf.memory.usedJSHeapSize;
          msMin = Math.min(msMin, ms);
          msMax = Math.max(msMax, ms);
          msText.textContent = "Mem: " + bytesToSize(ms, 2);

          var normValue = ms / perf.memory.totalJSHeapSize;
          var height = Math.min(30, 30 - normValue * 30);
          updateGraph(msGraph, height, color);

          function bytesToSize(bytes, nFractDigit) {
            var sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB'];
            if (bytes == 0) return 'n/a';
            nFractDigit = nFractDigit !== undefined ? nFractDigit : 0;
            var precision = Math.pow(10, nFractDigit);
            var i = Math.floor(Math.log(bytes) / Math.log(1024));
            return Math.round(bytes * precision / Math.pow(1024, i)) / precision + ' ' + sizes[i];
          }
          ;
        }
      }
    }

    var stats = new MemoryStats();
    stats.domElement.style.position = 'fixed';
    stats.domElement.style.right = '0px';
    stats.domElement.style.bottom = '0px';
    document.body.appendChild(stats.domElement);
    setTimeout(function rAFloop() {
      stats.update();
      setTimeout(rAFloop, 1000);
    }, 1000);

    var RenderRate = function() {
      var container = document.createElement('div');
      container.id = 'stats';
      container.style.cssText = 'width:150px;opacity:0.9;cursor:pointer;position:fixed;right:106px;bottom:0px;';

      var msDiv = document.createElement('div');
      msDiv.id = 'ms';
      msDiv.style.cssText = 'padding:0 0 3px 3px;text-align:left;background-color:#020;';
      container.appendChild(msDiv);

      var msText = document.createElement('div');
      msText.id = 'msText';
      msText.style.cssText = 'color:#0f0;font-family:Helvetica,Arial,sans-serif;font-size:9px;font-weight:bold;line-height:15px';
      msText.innerHTML = 'Repaint rate: 0/sec';
      msDiv.appendChild(msText);

      var bucketSize = 20;
      var bucket = [];
      var lastTime = new Date();
      return {
        domElement: container,
        ping: function() {
          var start = lastTime;
          var stop = new Date();
          var rate = 1000 / (stop - start);
          bucket.push(rate);
          if (bucket.length > bucketSize) {
            bucket.shift();
          }
          var sum = 0;
          for (var i = 0; i < bucket.length; i++) {
            sum = sum + bucket[i];
          }
          msText.textContent = "Repaint rate: " + (sum / bucket.length).toFixed(2) + "/sec";
          msText.innerText = "Repaint rate: " + (sum / bucket.length).toFixed(2) + "/sec";
          lastTime = stop;
        }
      }
    };

    var renderRate = new RenderRate();
    document.body.appendChild(renderRate.domElement);

    return {
      memoryStats: stats,
      renderRate: renderRate
    };

  })();
