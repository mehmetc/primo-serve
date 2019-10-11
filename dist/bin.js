'use strict';

var _primo = require('./primo');

var _primo2 = _interopRequireDefault(_primo);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

"use strict"; /*
              # primo-serve
              #
              # Catch command line arguments and run the proxy
              #
              # KULeuven/LIBIS
              # Mehmet Celik (c) 2018
              */

var argv = require('minimist')(process.argv.slice(2));
if (Object.keys(argv).includes('proxy') && Object.keys(argv).includes('vid')) {
  var baseDir = Object.keys(argv).includes('dir') ? argv.dir : process.cwd();
  console.log("Serving Primo...");
  console.log(' vid = "' + argv.vid + '"\n proxy = "' + argv.proxy + '"\n dir = "' + baseDir + '"');
  var primo = new _primo2.default(argv.vid, argv.proxy, baseDir);
  primo.serve();
} else {
  console.log('Usage: primoServe --vid=NUI --proxy=https://your.primo.url --dir=/directory/to/vids');
}