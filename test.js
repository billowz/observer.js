var resolve = require('resolve');
resolve('utility.js/log', {
  basedir: __dirname
}, function(err, res) {
  if (err) {
    console.error(err)
  } else {
    console.log(res)
  }
});
